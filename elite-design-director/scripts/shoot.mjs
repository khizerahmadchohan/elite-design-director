#!/usr/bin/env node
// elite-design-director / shoot.mjs
// Headless multi-width screenshots + basic render checks, using the locally installed
// Chrome / Edge / Chromium over the DevTools protocol. No npm dependencies (Node >= 22).
//
// Usage:
//   node shoot.mjs <url | file.html> [outDir] [--widths 390x844,768,1280x800,1440x900] [--full] [--no-js]
//                  [--height 900] [--reduced-motion] [--dark] [--wait 1500]
//                  [--around "<css selector>" [--context 700]]  (section-in-context capture)
//                  [--only] [--a11y [--tabs 40]] [--json]
// Output: <outDir>/<slug>-<W>x<H>[-dark].png, <outDir>/<slug>-report.json (full report), and a compact
//   summary on stdout (full JSON on stdout only with --json)
//   (horizontal overflow, console errors, failed requests, images missing alt/size,
//    elements hidden at rest, document height).

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
if (!args.length || args.includes('-h') || args.includes('--help')) {
  console.log(`Usage: node shoot.mjs <url|file.html[?query]> [outDir] [options]
  --widths 390x844,768,1280x800,1440x900   W or WxH list (default 390x844,768x1024,1280x800,1440x900)
  --height 900          default viewport height when an entry has no H
  --full                also capture the full page (max 16000px)
  --around "<sel>"      also capture that element plus --context px (default 700) above/below
  --only                metrics only, no screenshots
  --no-js               load with JavaScript disabled
  --reduced-motion      emulate prefers-reduced-motion: reduce
  --dark                emulate prefers-color-scheme: dark (files get -dark suffix)
  --wait 1200           ms to settle after load and lazy-scroll
  --a11y                keyboard Tab walk (focus indicator/traps/invisible focus), text contrast,
                        font loading, semantics (lang, landmarks, skip link, headings, labels)
  --tabs 40             max Tab presses for --a11y
  --json                print the full JSON report to stdout (always written to <slug>-report.json)`);
  process.exit(0);
}
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && ['--widths', '--height', '--wait', '--around', '--context', '--tabs'].includes(args[i - 1])));
let target = positional[0];
const outDir = resolve(positional[1] || 'screenshots');
// --widths accepts W or WxH entries, e.g. 390x844,768,1280x800,1440x900
const sizes = opt('--widths', '390x844,768x1024,1280x800,1440x900').split(',').map((e) => { const [w, h] = e.toLowerCase().split('x').map(Number); return { w, h: h || 0 }; }).filter((x) => x.w);
const height = Number(opt('--height', '900'));
const waitMs = Number(opt('--wait', '1200'));
const full = flag('--full');
const around = opt('--around', null); // CSS selector: capture this element plus neighbouring context above/below
const ctx = Number(opt('--context', '700'));
const only = flag('--only');
const a11y = flag('--a11y');
const maxTabs = Math.max(1, Math.min(Number(opt('--tabs', '40')) || 40, 300));

if (!/^https?:|^file:/.test(target)) {
  const [pathPart, ...q] = target.split(/(?=[?#])/);
  const p = resolve(pathPart);
  if (!existsSync(p)) { console.error('Not found: ' + p); process.exit(2); }
  target = pathToFileURL(p).href + q.join('');
}

function findBrowser() {
  const env = process.env.CHROME_PATH;
  const c = [env,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'];
  return c.find((p) => p && existsSync(p));
}
const browser = findBrowser();
if (!browser) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }
if (typeof WebSocket === 'undefined') { console.error('Node >= 22 required (global WebSocket).'); process.exit(2); }

const profile = mkdtempSync(join(tmpdir(), 'edd-shoot-'));
const proc = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', '--disable-extensions', 'about:blank'],
  { stdio: ['ignore', 'ignore', 'pipe'] });

const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  const t = setTimeout(() => rej(new Error('Browser did not start')), 20000);
  proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
  proc.on('exit', () => rej(new Error('Browser exited early')));
});

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const listeners = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  else listeners.forEach((l) => l(m));
});
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const mid = ++id;
  const to = setTimeout(() => { pending.delete(mid); rej(new Error('CDP timeout: ' + method)); }, 45000);
  pending.set(mid, { res: (v) => { clearTimeout(to); res(v); }, rej: (e) => { clearTimeout(to); rej(e); } });
  ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const waitEvent = (name, sessionId, ms = 30000) => new Promise((res) => {
  const t = setTimeout(() => res(null), ms);
  const l = (m) => { if (m.method === name && m.sessionId === sessionId) { clearTimeout(t); listeners.splice(listeners.indexOf(l), 1); res(m.params); } };
  listeners.push(l);
});

mkdirSync(outDir, { recursive: true });
const slugSrc = target.startsWith('file:') ? target.split('/').slice(-2).join('-').replace(/.html?(?=$|[?#])/i, '') : target;
const slug = (slugSrc.replace(/^\w+:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60)) || 'page';
const report = { target, browser, notes: full ? ['Full-page captures render fixed/sticky elements once at their top position; check fixedOrSticky and the viewport shots for overlap.'] : [], widths: {} };

const CHECK = `(() => {
  const vw = document.documentElement.clientWidth;
  const over = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 1 && r.height > 1 && r.right > vw + 1 && r.left < vw) {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && !el.closest('[aria-hidden="true"]')) over.push((el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : '')) + ' right=' + Math.round(r.right));
    }
    if (over.length > 8) break;
  }
  const imgs = [...document.images];
  const effHidden = (e) => { if (e.closest('[hidden],[aria-hidden="true"],dialog:not([open]),details:not([open]) > :not(summary)')) return false; for (let n = e; n && n !== document.documentElement; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none') return false; if (parseFloat(cs.opacity) < 0.05 || cs.visibility === 'hidden') return true; } return false; };
  const hiddenEls = [...document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,img')].filter(e => (e.textContent.trim() || e.tagName === 'IMG') && effHidden(e));
  const hidden = hiddenEls.length;
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : '') + (el.textContent.trim() ? ' "' + el.textContent.trim().slice(0, 30) + '"' : '');
  const smallEls = [...document.querySelectorAll('a,button,input,select,textarea,[role=button]')].filter(e => { const r = e.getBoundingClientRect(); const inProse = getComputedStyle(e).display === 'inline' && e.closest('p,li'); return r.width && r.height && !inProse && (r.width < 24 || r.height < 24); });
  const small = smallEls.length;
  return {
    scrollWidth: document.documentElement.scrollWidth, viewport: vw,
    horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
    overflowingElements: over,
    docHeight: document.documentElement.scrollHeight,
    imagesMissingAlt: imgs.filter(i => !i.hasAttribute('alt')).length,
    imagesMissingSize: imgs.filter(i => !i.getAttribute('width') && !i.style.aspectRatio && getComputedStyle(i).aspectRatio === 'auto').length,
    brokenImages: imgs.filter(i => i.complete && i.naturalWidth === 0).length,
    textHiddenAtRest: hidden,
    hiddenSamples: hiddenEls.slice(0, 6).map(desc),
    tinyTargets: small,
    tinyTargetList: smallEls.slice(0, 10).map(e => desc(e) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)),
    under44OnMobile: vw < 768 ? [...document.querySelectorAll('a,button,input,select,[role=button]')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && r.height < 44 && !(getComputedStyle(e).display === 'inline' && e.closest('p,li')); }).length : undefined,
    fixedOrSticky: [...document.querySelectorAll('body *')].filter(e => ['fixed','sticky'].includes(getComputedStyle(e).position)).slice(0, 5).map(desc),
    h1Count: document.querySelectorAll('h1').length,
    viewportMetaBlocksZoom: /user-scalable\\s*=\\s*no|maximum-scale\\s*=\\s*1(\\.0)?\\b/i.test(document.querySelector('meta[name=viewport]')?.content || ''),
    title: document.title
  };
})()`;

// ---- a11y helpers: real functions, serialized with toString() so no template escaping is needed ----
function a11yStatic() {
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true }); const cache = new Map();
  const rgba = (str) => { if (cache.has(str)) return cache.get(str); cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; const v = [d[0], d[1], d[2], d[3] / 255]; cache.set(str, v); return v; };
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgOf = (el) => { const layers = []; let onImage = false; for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.backgroundImage && cs.backgroundImage !== 'none') { onImage = true; break; } const c = rgba(cs.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } } let base = [255, 255, 255, 1]; for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base); return { bg: base, onImage }; };
  const visible = (el) => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) return false; } return true; };
  const fails = []; const onImg = []; let checked = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (checked >= 2500) break;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'svg', 'TEMPLATE'].includes(el.tagName)) continue;
    const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (!t || !visible(el)) continue;
    checked++;
    const cs = getComputedStyle(el);
    const { bg, onImage } = bgOf(el);
    const fgRaw = rgba(cs.color); const fg = over(fgRaw, bg);
    const a = L(fg), b = L(bg); const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const px = parseFloat(cs.fontSize), wt = parseInt(cs.fontWeight) || 400;
    const large = px >= 24 || (px >= 18.66 && wt >= 700); const need = large ? 3 : 4.5;
    if (onImage) { if (onImg.length < 5) onImg.push(desc(el) + ' "' + t.slice(0, 30) + '"'); continue; }
    if (ratio < need) fails.push({ el: desc(el), text: t.slice(0, 30), ratio: +ratio.toFixed(2), need, px: Math.round(px), color: cs.color, bg: 'rgb(' + bg.slice(0, 3).map(Math.round).join(',') + ')' });
  }
  const seen = new Set(); const uniq = fails.sort((x, y) => x.ratio - y.ratio).filter((f) => { const k = f.el + f.ratio; if (seen.has(k)) return false; seen.add(k); return true; });
  // fonts
  const generic = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|-apple-system|blinkmacsystemfont|ui-\w+|emoji|math|inherit)$/i;
  const faces = [...document.fonts];
  const fonts = {};
  for (const sel of ['h1', 'h2', 'h3', 'p', 'a', 'button', 'input']) {
    const el = document.querySelector(sel); if (!el) continue;
    const fam = getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
    if (fonts[fam]) { fonts[fam].used.push(sel); continue; }
    const decl = faces.filter((f) => f.family.replace(/^["']|["']$/g, '').toLowerCase() === fam.toLowerCase());
    let status;
    if (generic.test(fam)) status = 'generic';
    else if (decl.length) status = decl.some((f) => f.status === 'loaded') ? 'loaded' : 'declared-not-loaded (fallback rendering)';
    else status = 'not declared (local/system font; may fall back)';
    fonts[fam] = { used: [sel], status };
  }
  // semantics
  const focusSel = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex],summary,[contenteditable=""],[contenteditable=true]';
  const focusables = [...document.querySelectorAll(focusSel)].filter((e) => e.tabIndex >= 0 && !e.disabled);
  const first = focusables[0];
  const skipLink = !!(first && first.tagName === 'A' && /^#.+/.test(first.getAttribute('href') || ''));
  const lm = (tag, role) => document.querySelectorAll(tag + ',[role=' + role + ']').length;
  const landmarks = { header: lm('header', 'banner'), nav: lm('nav', 'navigation'), main: lm('main', 'main'), footer: lm('footer', 'contentinfo') };
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
  const headingSkips = []; hs.forEach((l, i) => { if (i && l > hs[i - 1] + 1) headingSkips.push('h' + hs[i - 1] + '>h' + l); });
  const unlabeled = [...document.querySelectorAll('input,select,textarea')].filter((e) => {
    if (/^(hidden|submit|button|reset|image)$/i.test(e.type)) return false;
    return !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby') && !e.closest('label');
  }).slice(0, 10).map((e) => desc(e) + (e.placeholder ? ' (placeholder only: "' + e.placeholder.slice(0, 25) + '")' : ''));
  return {
    contrast: { checked, failures: uniq.length, list: uniq.slice(0, 15), onImage: onImg },
    fonts,
    semantics: { lang: document.documentElement.getAttribute('lang') || null, landmarks, skipLink, headings: hs.join(','), headingSkips: [...new Set(headingSkips)], unlabeled }
  };
}
function focusInfo() {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return { none: true };
  window.__eddIds ||= new WeakMap(); window.__eddN ||= 0;
  if (!window.__eddIds.has(el)) window.__eddIds.set(el, ++window.__eddN);
  const desc = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ((el.getAttribute('aria-label') || el.textContent || '').trim() ? ' "' + (el.getAttribute('aria-label') || el.textContent).trim().replace(/\s+/g, ' ').slice(0, 24) + '"' : (el.getAttribute('name') || el.getAttribute('placeholder') ? '[' + (el.getAttribute('name') || el.getAttribute('placeholder')).slice(0, 20) + ']' : ''));
  const r = el.getBoundingClientRect();
  let hidden = r.width < 1 || r.height < 1;
  for (let n = el; n && !hidden; n = n.parentElement) { const c = getComputedStyle(n); if (c.visibility === 'hidden' || parseFloat(c.opacity) < 0.05) hidden = true; }
  const inView = r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  const props = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'borderTopColor', 'borderBottomColor', 'backgroundColor', 'color', 'textDecorationLine'];
  const snap = () => { const c = getComputedStyle(el); return Object.fromEntries(props.map((p) => [p, c[p]])); };
  const f = snap();
  el.blur(); const u = snap(); el.focus({ preventScroll: true });
  const outline = f.outlineStyle !== 'none' && parseFloat(f.outlineWidth) > 0;
  const changed = props.filter((p) => f[p] !== u[p]);
  const indicator = outline || (f.boxShadow !== 'none' && f.boxShadow !== u.boxShadow) || changed.length > 0;
  return { id: window.__eddIds.get(el), desc, rect: { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }, inView, hidden, outline: outline ? f.outlineStyle + ' ' + f.outlineWidth : 'none', boxShadow: f.boxShadow === 'none' ? 'none' : 'set', changed, indicator };
}

try {
  for (const { w, h: hh } of sizes) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const consoleErrors = []; const failed = [];
    const l = (m) => {
      if (m.sessionId !== sessionId) return;
      if (m.method === 'Runtime.exceptionThrown') consoleErrors.push(m.params.exceptionDetails?.exception?.description?.split('\n')[0] || m.params.exceptionDetails?.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') consoleErrors.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200));
      if (m.method === 'Network.loadingFailed' && !m.params.canceled) failed.push(m.params.errorText);
    };
    listeners.push(l);
    await send('Page.enable', {}, sessionId); await send('Runtime.enable', {}, sessionId); await send('Network.enable', {}, sessionId);
    const mobile = w < 768;
    const vh = hh || (mobile ? Math.max(height, 844) : height);
    const key = w + 'x' + vh;
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: vh, deviceScaleFactor: 1, mobile }, sessionId);
    if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true }, sessionId);
    const feats = [];
    if (flag('--reduced-motion')) feats.push({ name: 'prefers-reduced-motion', value: 'reduce' });
    if (flag('--dark')) feats.push({ name: 'prefers-color-scheme', value: 'dark' });
    if (feats.length) await send('Emulation.setEmulatedMedia', { features: feats }, sessionId);
    if (flag('--no-js')) await send('Emulation.setScriptExecutionDisabled', { value: true }, sessionId);
    const loaded = waitEvent('Page.loadEventFired', sessionId, 30000);
    await send('Page.navigate', { url: target }, sessionId);
    await loaded;
    if (flag('--no-js')) await new Promise((r) => setTimeout(r, 300));
    if (flag('--no-js')) await send('Emulation.setScriptExecutionDisabled', { value: false }, sessionId); // page loaded without scripts; re-enable only for our measurement
    // scroll through to trigger lazy content, then back to top
    await send('Runtime.evaluate', { expression: `(async()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);await document.fonts?.ready;})()`, awaitPromise: true }, sessionId);
    await new Promise((r) => setTimeout(r, waitMs));
    const { result } = await send('Runtime.evaluate', { expression: CHECK, returnByValue: true }, sessionId);
    let clip;
    if (around) {
      const { result: rr } = await send('Runtime.evaluate', { expression: `(() => { const el = document.querySelector(${JSON.stringify(around)}); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, height: r.height, docH: document.documentElement.scrollHeight }; })()`, returnByValue: true }, sessionId);
      if (rr.value) { const y = Math.max(0, rr.value.top - ctx); const hgt = Math.min(rr.value.height + ctx * 2, rr.value.docH - y, 16000); clip = { x: 0, y, width: w, height: hgt, scale: 1 }; result.value.around = { selector: around, top: Math.round(rr.value.top), height: Math.round(rr.value.height) }; }
      else result.value.around = { selector: around, error: 'selector not found' };
    }
    const stem = `${slug}-${key}${flag('--no-js') ? '-nojs' : ''}${flag('--reduced-motion') ? '-rm' : ''}${flag('--dark') ? '-dark' : ''}`;
    const files = [];
    const cap = async (c, suffix, beyond = !String(suffix).includes('focus')) => { const sh = await send('Page.captureScreenshot', { format: 'png', ...(c ? { clip: c, captureBeyondViewport: beyond } : {}) }, sessionId); const fp = join(outDir, stem + suffix + '.png'); writeFileSync(fp, Buffer.from(sh.data, 'base64')); files.push(fp); };
    if (!only) {
      await cap(null, '');
      if (full) await cap({ x: 0, y: 0, width: w, height: Math.min(result.value.docHeight, 16000), scale: 1 }, '-full');
      if (around && clip) await cap(clip, '-around');
    }
    if (a11y) {
      const { result: st } = await send('Runtime.evaluate', { expression: `(${a11yStatic})()`, returnByValue: true }, sessionId);
      const A = st.value || { error: st.description };
      // real keyboard Tab walk
      await send('Page.bringToFront', {}, sessionId).catch(() => {});
      await send('Runtime.evaluate', { expression: 'scrollTo(0,0); document.activeElement && document.activeElement.blur(); window.focus();' }, sessionId);
      const stops = []; let trap = null; let prev = null; let repeat = 0; let bodyHits = 0;
      for (let t = 0; t < maxTabs; t++) {
        for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, sessionId);
        await send('Runtime.evaluate', { expression: "document.activeElement && document.activeElement !== document.body && document.activeElement.scrollIntoView({block:'nearest', inline:'nearest', behavior:'instant'})" }, sessionId);
        await new Promise((r) => setTimeout(r, 40));
        const { result: fr } = await send('Runtime.evaluate', { expression: `(${focusInfo})()`, returnByValue: true }, sessionId);
        const fi = fr.value || { none: true };
        if (fi.none) { if (++bodyHits >= 2 || stops.length) break; continue; }
        if (stops.length && fi.id === stops[0].id) break; // completed a cycle
        if (prev && fi.id === prev.id) { if (++repeat >= 2) { trap = fi.desc; break; } continue; }
        if (stops.some((x) => x.id === fi.id)) { trap = 'focus loops back to ' + fi.desc + ' without reaching the end'; stops.push(fi); break; }
        repeat = 0; prev = fi; stops.push(fi);
      }
      const noInd = stops.filter((x) => !x.indicator && !x.hidden);
      const invisible = stops.filter((x) => x.hidden || !x.inView);
      A.tabWalk = { stops: stops.length, maxTabs, trap, noIndicator: noInd.map((x) => x.desc), invisibleFocus: invisible.map((x) => x.desc + (x.hidden ? ' (hidden)' : ' (off-viewport)')), order: stops.slice(0, 40).map((x) => x.desc), shots: [] };
      if (!only) {
        for (const x of [...noInd, ...stops.filter((s) => s.indicator)].slice(0, 3)) {
          // refocus that stop, bring it into the viewport, then read a fresh rect (keyboard modality keeps :focus-visible)
          const { result: rr } = await send('Runtime.evaluate', { expression: `(() => { for (const e of document.querySelectorAll('*')) if (window.__eddIds && window.__eddIds.get(e) === ${x.id}) { e.focus({ preventScroll: true }); e.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' }); const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; } return null; })()`, returnByValue: true }, sessionId);
          const fr = rr && rr.value; if (!fr) continue;
          await new Promise((r) => setTimeout(r, 150));
          const pad = 40; const c = { x: Math.max(0, fr.x - pad), y: Math.max(0, fr.y - pad), width: Math.min(w, fr.w + pad * 2), height: Math.min(600, fr.h + pad * 2), scale: 1 };
          if (c.width < 2 || c.height < 2) continue;
          const before = files.length;
          await cap(c, '-focus' + (A.tabWalk.shots.length + 1));
          if (files.length > before) A.tabWalk.shots.push(files.pop());
        }
      }
      result.value.a11y = A;
    }
    const file = files[0] || null;
    if (result.value.horizontalOverflow && !result.value.overflowingElements.length) result.value.overflowingElements.push('(no element box overflows: likely a ::before/::after pseudo-element, a transform, or a negative margin; inspect those)');
    report.widths[key] = { file, files, ...result.value, consoleErrors: [...new Set(consoleErrors)].slice(0, 10), failedRequests: [...new Set(failed)].slice(0, 10) };
    listeners.splice(listeners.indexOf(l), 1);
    await send('Target.closeTarget', { targetId });
  }
} catch (e) {
  report.error = String(e.message || e);
} finally {
  try { await send('Browser.close'); } catch {}
  proc.kill();
  setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
}
const rel = (p) => (p ? relative(outDir, p) || p : '-');
const reportPath = join(outDir, slug + '-report.json');
try { writeFileSync(reportPath, JSON.stringify(report, null, 2)); } catch {}
if (flag('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`shoot: ${target.length > 90 ? '...' + target.slice(-87) : target}  -> ${outDir}  (full report: ${rel(reportPath)})`);
  if (report.error) console.log('ERROR: ' + report.error);
  for (const [k, r] of Object.entries(report.widths)) {
    console.log(`${k.padEnd(9)} overflow:${r.horizontalOverflow ? 'YES ' + (r.overflowingElements[0] || '') : 'no'} | hidden:${r.textHiddenAtRest} | tiny:${r.tinyTargets}${r.under44OnMobile !== undefined ? ' (<44 mobile: ' + r.under44OnMobile + ')' : ''} | errors:${r.consoleErrors.length} | failedReq:${r.failedRequests.length} | imgNoAlt:${r.imagesMissingAlt} | zoomBlocked:${r.viewportMetaBlocksZoom} | files:${r.files.map(rel).join(',') || '-'}`);
    const A = r.a11y; if (!A) continue;
    if (A.error) { console.log('  a11y error: ' + A.error); continue; }
    const tw = A.tabWalk, c = A.contrast, se = A.semantics;
    if (only && !globalThis.__eddOnlyNote) { globalThis.__eddOnlyNote = 1; console.log('  note: --only writes no screenshots (incl. focus shots); drop --only to capture them.'); }
    console.log(`  tab: ${tw.stops} stops${tw.trap ? ' | TRAP: ' + tw.trap : ''} | no focus indicator: ${tw.noIndicator.length}${tw.noIndicator.length ? ' (' + tw.noIndicator.slice(0, 3).join('; ') + ')' : ''} | invisible focus: ${tw.invisibleFocus.length}${tw.invisibleFocus.length ? ' (' + tw.invisibleFocus.slice(0, 2).join('; ') + ')' : ''}${tw.shots.length ? ' | shots: ' + tw.shots.map(rel).join(',') : ''}`);
    console.log(`  contrast: ${c.failures} fail of ${c.checked} text els${c.list.length ? ' | worst: ' + c.list.slice(0, 3).map((f) => f.ratio + ' ' + f.el + ' "' + f.text + '"').join('; ') : ''}${c.onImage.length ? ' | on image (verify manually): ' + c.onImage.length : ''}`);
    console.log(`  fonts: ${Object.entries(A.fonts).map(([f, v]) => f + '=' + (v.status === 'loaded' ? 'ok' : v.status)).join(', ')}`);
    console.log(`  semantics: lang=${se.lang || 'MISSING'} | landmarks h${se.landmarks.header}/n${se.landmarks.nav}/m${se.landmarks.main}/f${se.landmarks.footer} | skip link:${se.skipLink ? 'yes' : 'no'} | heading skips:${se.headingSkips.join(',') || 'none'} | unlabeled inputs:${se.unlabeled.length}${se.unlabeled.length ? ' (' + se.unlabeled.slice(0, 2).join('; ') + ')' : ''}`);
  }
}
process.exitCode = report.error ? 1 : 0;
