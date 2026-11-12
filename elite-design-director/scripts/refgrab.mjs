#!/usr/bin/env node
// elite-design-director / refgrab.mjs
// Polite, sequential capture of design-reference pages (Dribbble, Pinterest, Behance, studio
// sites, live websites) for visual research. Uses the locally installed Chrome/Edge over the
// DevTools protocol. No npm dependencies (Node >= 22). Original implementation.
//
// What it does per URL: renders at 1440x900, waits, screenshots the first viewport (and
// optionally a taller capture), extracts public page metadata (title, og:title, og:image,
// og:description, canonical, author), detects login walls / bot challenges, and for listing
// pages (search, tag, board, ideas) collects candidate item links (shots, pins, projects).
//
// It never logs in, never dismisses or hides login walls, never solves CAPTCHAs, and caps
// each run at --max pages (default 10) with a delay between pages (default 2500 ms).
//
// Usage:
//   node refgrab.mjs <outDir> <url> [url ...] [--max 10] [--delay 2500] [--tall] [--images] [--wait 3500]
//   node refgrab.mjs <outDir> --file urls.txt
// Output: <outDir>/ref-NN-<slug>.png (+ -tall.png, -og.<ext> with --images) and <outDir>/refs.json,
//   shaped as { captured: [ { url, status, title, ogTitle, author, ogImage, ogDescription, canonical,
//   outbound[], items[{url,label,image}], tags[], screenshot, imageFile, loginWall, challenge } ] } (appended across runs).
// Creator names: trust only `author` captured here (rendered page), never search-result snippets.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
if (args.length < 2 || args.includes('--help')) {
  console.log(`Usage: node refgrab.mjs <outDir> <url> [url ...] [--file urls.txt] [--max 10] [--delay 2500] [--wait 3500] [--tall] [--images] [--json]
  --file   read URLs (one per line)
  --max    pages per run (default 10, cap 25)
  --delay  ms between pages (default 2500, min 1500)
  --wait   ms after load (default 3500)
  --tall   also capture up to 2700px tall
  --images download og:image
  --json   print full JSON summary to stdout`);
  process.exit(0);
}
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const valued = new Set(['--max', '--delay', '--wait', '--file']);
const pos = args.filter((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));
const outDir = resolve(pos[0]);
let urls = pos.slice(1);
if (opt('--file')) urls = urls.concat(readFileSync(opt('--file'), 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => /^https?:/.test(s)));
const num = (n, d) => { const v = Number(opt(n, String(d))); return Number.isFinite(v) && v >= 0 ? v : d; };
const max = Math.max(1, Math.min(Math.floor(num('--max', 10)), 25));
const delay = Math.max(num('--delay', 2500), 1500);
const waitMs = num('--wait', 3500);
const tall = args.includes('--tall');
urls = [...new Set(urls)].slice(0, max);
if (!urls.length) { console.error('No URLs.'); process.exit(2); }

const browser = [process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p));
if (!browser) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'edd-ref-'));
const proc = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
  '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--disable-extensions', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((res, rej) => {
  let buf = ''; const t = setTimeout(() => rej(new Error('Browser did not start')), 20000);
  proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
});
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const listeners = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } else listeners.forEach((l) => l(m)); });
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const mid = ++id; const to = setTimeout(() => { pending.delete(mid); rej(new Error('CDP timeout: ' + method)); }, 45000);
  pending.set(mid, { res: (v) => { clearTimeout(to); res(v); }, rej: (e) => { clearTimeout(to); rej(e); } });
  ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const waitEvent = (name, sessionId, ms) => new Promise((res) => { const t = setTimeout(() => res(null), ms); const l = (m) => { if (m.method === name && m.sessionId === sessionId) { clearTimeout(t); listeners.splice(listeners.indexOf(l), 1); res(m.params); } }; listeners.push(l); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXTRACT = `(() => {
  const meta = (p) => document.querySelector('meta[property="' + p + '"],meta[name="' + p + '"]')?.content || null;
  const host = location.hostname;
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const pw = [...document.querySelectorAll('input[type=password]')].some(visible);
  const bodyText = document.body?.innerText?.slice(0, 4000) || '';
  const challenge = /verify you are human|are you a robot|captcha|unusual traffic|access denied|attention required/i.test(bodyText);
  const wall = pw || /log in to see more|sign up to see more|log in to continue/i.test(bodyText);
  const itemRe = /\\/shots\\/\\d+|\\/pin\\/\\d+|\\/gallery\\/\\d+|\\/projects?\\//;
  const items = []; const seen = new Set();
  for (const a of document.querySelectorAll('a[href]')) {
    const href = a.href.split('?')[0];
    if (!itemRe.test(href) || seen.has(href)) continue;
    seen.add(href);
    const img = a.querySelector('img');
    const label = (a.getAttribute('aria-label') || img?.alt || a.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 140);
    items.push({ url: href, label, image: img?.currentSrc || img?.src || null });
    if (items.length >= 30) break;
  }
  // outbound "original source" links (e.g. a pin's Visit link), same-page external links with rel=nofollow/noopener
  const outbound = [...document.querySelectorAll('a[href^="http"]')].map(a => a.href).filter(h => { try { const u = new URL(h); return !u.hostname.endsWith(host.replace(/^www\\./, '')) && !/pinterest|dribbble|facebook|twitter|x\\.com|instagram|linkedin|google|apple\\.com|tiktok|youtube/.test(u.hostname); } catch { return false; } });
  const byline = (document.title.match(/ by (.+?) on (Dribbble|Behance)/) || [])[1];
  const author = byline || meta('author') || meta('twitter:creator') || document.querySelector('[rel=author],.shot-user-link,[data-test-id="creator-card"] a, a[href*="/"] .user-name')?.textContent?.trim() || null;
  return {
    finalUrl: location.href, title: document.title, ogTitle: meta('og:title'), ogDescription: meta('og:description') || meta('description'),
    ogImage: meta('og:image'), canonical: document.querySelector('link[rel=canonical]')?.href || null, author,
    loginWall: wall, challenge, items, outbound: [...new Set(outbound)].slice(0, 5),
    tags: [...document.querySelectorAll('a[href*="/tags/"], a[href*="/ideas/"]')].map(a => a.textContent.trim()).filter(Boolean).slice(0, 12),
    docHeight: document.documentElement.scrollHeight
  };
})()`;

const jsonPath = join(outDir, 'refs.json');
const store = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, 'utf8')) : { captured: [] };
let n = store.captured.length;
const slug = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 50).replace(/-$/, '');

try {
  for (const [i, url] of urls.entries()) {
    if (i) await sleep(delay);
    const rec = { url, capturedAt: new Date().toISOString() };
    let targetId;
    try {
      ({ targetId } = await send('Target.createTarget', { url: 'about:blank' }));
      const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
      await send('Page.enable', {}, sessionId); await send('Runtime.enable', {}, sessionId);
      await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
      const loaded = waitEvent('Page.loadEventFired', sessionId, 30000);
      await send('Page.navigate', { url }, sessionId);
      await loaded; await sleep(waitMs);
      await send('Runtime.evaluate', { expression: `(async()=>{for(let y=0;y<2400;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,250));}scrollTo(0,0);await new Promise(r=>setTimeout(r,400));})()`, awaitPromise: true }, sessionId);
      const { result } = await send('Runtime.evaluate', { expression: EXTRACT, returnByValue: true }, sessionId);
      Object.assign(rec, result.value);
      if (rec.ogImage) { try { rec.ogImage = new URL(rec.ogImage, rec.finalUrl || url).href; } catch {} }
      n++;
      const base = `ref-${String(n).padStart(2, '0')}-${slug(url)}`;
      const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
      rec.screenshot = join(outDir, base + '.png'); writeFileSync(rec.screenshot, Buffer.from(shot.data, 'base64'));
      if (tall && !rec.loginWall && !rec.challenge) {
        const h = Math.min(rec.docHeight || 2700, 2700);
        const t = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1440, height: h, scale: 1 }, captureBeyondViewport: true }, sessionId);
        rec.screenshotTall = join(outDir, base + '-tall.png'); writeFileSync(rec.screenshotTall, Buffer.from(t.data, 'base64'));
      }
      if (args.includes('--images') && rec.ogImage && !rec.challenge) {
        try { const r = await fetch(rec.ogImage); if (r.ok && /image/.test(r.headers.get('content-type') || '')) { const ext = (r.headers.get('content-type').split('/')[1] || 'jpg').split(';')[0].replace('jpeg', 'jpg'); rec.imageFile = join(outDir, base + '-og.' + ext); writeFileSync(rec.imageFile, Buffer.from(await r.arrayBuffer())); } } catch {}
      }
      rec.status = rec.challenge ? 'blocked-challenge' : rec.loginWall ? 'login-wall (partial view; metadata only; do not bypass)' : 'ok';
    } catch (e) { rec.status = 'error: ' + (e.message || e); }
    finally { if (targetId) { try { await send('Target.closeTarget', { targetId }); } catch {} } }
    store.captured.push(rec);
    console.error(`[${i + 1}/${urls.length}] ${rec.status}  ${url}`);
  }
} finally {
  writeFileSync(jsonPath, JSON.stringify(store, null, 2));
  try { await send('Browser.close'); } catch {}
  proc.kill(); setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
}
const summary = store.captured.slice(-urls.length).map((r) => ({ url: r.url, status: r.status, title: r.ogTitle || r.title, author: r.author, ogImage: r.ogImage, outbound: r.outbound, items: (r.items || []).length, screenshot: r.screenshot }));
if (args.includes('--json')) { console.log(JSON.stringify({ refsJson: jsonPath, captured: summary }, null, 2)); process.exit(0); }
const rel = (p) => p ? relative(outDir, p) : '-';
console.log('refs.json: ' + jsonPath);
for (const r of summary) console.log('- ' + r.status.split(' ')[0] + ' | ' + (r.title || '').slice(0, 60) + ' | by ' + (r.author || '?') + ' | items:' + r.items + ' | shot:' + rel(r.screenshot));
process.exit(0);
