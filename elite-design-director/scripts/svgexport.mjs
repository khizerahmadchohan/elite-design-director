#!/usr/bin/env node
// elite-design-director / svgexport.mjs
// From one SVG master: colour variants, PNG renders, and a web-icon kit (favicon.ico, apple-touch,
// 192/512, maskable, webmanifest, <head> snippet). Renders with local Chrome/Edge via DevTools.
// No npm dependencies (Node >= 22). Original implementation.
//
// Usage: node svgexport.mjs master.svg --out kit [--variants] [--mono #0F172A] [--png 32,512,1024]
//                           [--web-icons] [--favicon-source small.svg] [--bg #FFFFFF] [--name brand] [--themes]
// Feed the full-colour master: --variants derives black/white/mono/currentColor from it.
// --themes bakes <name>-light.svg and <name>-dark.svg from CSS custom properties declared in the SVG's
//   <style> (:root{--x:..} and @media (prefers-color-scheme:dark){:root{--x:..}}), for sanitizers that strip <style>.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log('Usage: node svgexport.mjs master.svg --out kit [--variants] [--mono #HEX] [--png 32,512,1024] [--web-icons] [--favicon-source small.svg] [--bg #HEX] [--name brand]'); process.exit(0); }
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const src = resolve(args[0]); if (!existsSync(src)) { console.error('Not found: ' + src); process.exit(2); }
const out = resolve(opt('--out', 'kit')); mkdirSync(out, { recursive: true });
const name = opt('--name', basename(src, '.svg').replace(/-(master|primary|v\d+)$/i, ''));
const master = readFileSync(src, 'utf8');
const favSrc = opt('--favicon-source') ? readFileSync(resolve(opt('--favicon-source')), 'utf8') : master;
const pngSizes = (opt('--png', '') || '').split(',').map(Number).filter(Boolean);
const bg = opt('--bg', '#FFFFFF');
const written = [];
if (args.includes('--themes')) {
  const style = (master.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [])[1] || '';
  const vars = (block) => Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)].map((m) => [m[1], m[2].trim()]));
  const darkBlock = (style.match(/prefers-color-scheme\s*:\s*dark[^{]*\{([\s\S]*?\})\s*\}/i) || [])[1] || '';
  const lightVars = vars(style.replace(/@media[\s\S]*$/i, ''));
  const darkVars = { ...lightVars, ...vars(darkBlock) };
  if (!Object.keys(lightVars).length) console.error('--themes: no CSS custom properties found in <style>; nothing baked.');
  else for (const [k, v] of [['light', lightVars], ['dark', darkVars]]) {
    let s = master.replace(/<style[^>]*>[\s\S]*?<\/style>/i, '');
    s = s.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/g, (m, n, fb) => v[n] || (fb || m).trim());
    const f = join(out, `${name}-${k}.svg`); writeFileSync(f, s); written.push(f);
  }
}

// ---------- colour variants (text-level recolour of fills, strokes and gradient stops) ----------
const COLOR = /(fill|stroke|stop-color|color)\s*(=\s*["']|:\s*)(?!none|transparent|url\(|inherit)(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|[a-zA-Z]+)(["';])?/g;
function recolor(svg, to) {
  // every painted colour becomes the target colour (one-colour variant); none/transparent/url() refs are kept
  return svg.replace(COLOR, (m, prop, sep, val, end) => `${prop}${sep}${to}${end || ''}`);
}
function ensureFill(svg, to) { return /<svg[^>]*\sfill=/.test(svg) ? svg : svg.replace('<svg', `<svg fill="${to}"`); }
if (args.includes('--variants') || opt('--mono')) {
  const v = { black: '#000000', white: '#FFFFFF', current: 'currentColor' };
  if (opt('--mono')) v.mono = opt('--mono');
  for (const [k, c] of Object.entries(v)) {
    const svg = ensureFill(recolor(master, c), c);
    const f = join(out, `${name}-${k}.svg`); writeFileSync(f, svg); written.push(f);
  }
}

// ---------- renderer ----------
const browser = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p));
const needRender = pngSizes.length || args.includes('--web-icons');
if (needRender && !browser) { console.error('No Chrome/Edge found (CHROME_PATH) — cannot render PNGs.'); process.exit(2); }
let send, proc, profile;
async function startBrowser() {
  profile = mkdtempSync(join(tmpdir(), 'edd-exp-'));
  proc = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--disable-extensions', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const wsUrl = await new Promise((res, rej) => { let b = ''; const t = setTimeout(() => rej(new Error('Browser did not start')), 20000); proc.stderr.on('data', (d) => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } }); });
  const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } });
  const raw = (method, params = {}, sessionId) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, { res, rej }); ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const { targetId } = await raw('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await raw('Target.attachToTarget', { targetId, flatten: true });
  send = (m, p) => raw(m, p, sessionId);
  return () => { raw('Browser.close').catch(() => {}); proc.kill(); setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch {} }, 500); };
}
// render svg text to PNG at w x h; pad = fraction of padding; fill = background colour or null (transparent)
const RENDER = (svg, w, h, pad, fill) => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    if (fill) { x.fillStyle = fill; x.fillRect(0, 0, w, h); }
    const ir = (img.naturalWidth || w) / (img.naturalHeight || h);
    let bw = w * (1 - 2 * pad), bh = h * (1 - 2 * pad);
    if (ir > bw / bh) bh = bw / ir; else bw = bh * ir;
    x.imageSmoothingQuality = 'high';
    x.drawImage(img, (w - bw) / 2, (h - bh) / 2, bw, bh);
    res(c.toDataURL('image/png').split(',')[1]);
  };
  img.onerror = () => rej('render failed');
  // give the SVG an intrinsic size from its viewBox so aspect ratio is preserved
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1]; let s = svg;
  if (vb && !/<svg[^>]*\swidth=/.test(svg)) { const [, , vw, vh] = vb.split(/[\s,]+/).map(Number); s = svg.replace('<svg', `<svg width="${vw * 4}" height="${vh * 4}"`); }
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(s)));
});
async function png(svg, w, h, pad = 0, fill = null) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: `(${RENDER})(${JSON.stringify(svg)},${w},${h},${pad},${JSON.stringify(fill)})`, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error('render failed: ' + (exceptionDetails.exception?.value || exceptionDetails.text));
  return Buffer.from(result.value, 'base64');
}
function ico(pngs) { // pngs: [{size, buf}]
  const n = pngs.length, head = Buffer.alloc(6 + 16 * n); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(n, 4);
  let off = head.length;
  pngs.forEach((p, i) => { const e = 6 + 16 * i; head.writeUInt8(p.size >= 256 ? 0 : p.size, e); head.writeUInt8(p.size >= 256 ? 0 : p.size, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(p.buf.length, e + 8); head.writeUInt32LE(off, e + 12); off += p.buf.length; });
  return Buffer.concat([head, ...pngs.map((p) => p.buf)]);
}

if (needRender) {
  const stop = await startBrowser();
  try {
    for (const s of pngSizes) { const f = join(out, `${name}-${s}.png`); writeFileSync(f, await png(master, s, s)); written.push(f); }
    if (args.includes('--web-icons')) {
      const fd = join(out, 'favicon'); mkdirSync(fd, { recursive: true });
      const small = {};
      for (const s of [16, 32, 48]) { small[s] = await png(favSrc, s, s, 0.04); writeFileSync(join(fd, `favicon-${s}.png`), small[s]); }
      writeFileSync(join(fd, 'favicon.ico'), ico([16, 32, 48].map((s) => ({ size: s, buf: small[s] }))));
      writeFileSync(join(fd, 'favicon.svg'), favSrc);
      writeFileSync(join(fd, 'apple-touch-icon.png'), await png(favSrc, 180, 180, 0.12, bg));
      writeFileSync(join(fd, 'icon-192.png'), await png(favSrc, 192, 192, 0.06));
      writeFileSync(join(fd, 'icon-512.png'), await png(favSrc, 512, 512, 0.06));
      writeFileSync(join(fd, 'maskable-512.png'), await png(favSrc, 512, 512, 0.2, bg)); // safe zone: central 80%
      writeFileSync(join(fd, 'site.webmanifest'), JSON.stringify({ name, short_name: name, icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }], theme_color: bg, background_color: bg, display: 'standalone' }, null, 2));
      writeFileSync(join(fd, 'head-snippet.html'), ['<link rel="icon" href="/favicon.ico" sizes="any">', '<link rel="icon" href="/favicon.svg" type="image/svg+xml">', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">', '<link rel="manifest" href="/site.webmanifest">'].join('\n') + '\n');
      written.push(fd + '/ (favicon.ico 16/32/48, favicon-16/32/48.png, favicon.svg, apple-touch-icon.png, icon-192/512.png, maskable-512.png, site.webmanifest, head-snippet.html)');
    }
  } finally { stop(); }
}
console.log(`svgexport -> ${out}`);
for (const w of written) console.log('  ' + w.replace(out, '.'));
if (!written.length) console.log('  (nothing requested: add --variants, --mono, --png or --web-icons)');
