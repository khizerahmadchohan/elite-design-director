#!/usr/bin/env node
// elite-design-director / svgcheck.mjs
// Validate, audit, render and (optionally) optimize SVG files using the local Chrome/Edge
// (DevTools protocol). No npm dependencies (Node >= 22). Original implementation.
//
// Usage:
//   node svgcheck.mjs <file.svg|dir> [...] [--out dir] [--sizes 16,24,32,64,256] [--set] [--optimize] [--json]
//     --set       treat all inputs as one icon set: check shared viewBox, stroke width, fill/stroke style, visual weight
//     --optimize  write <name>.min.svg next to --out (rounded numbers, no metadata/comments/editor attrs)
//     --out       where contact sheets / optimized files go (default ./svgcheck-out)
// Output: compact report per file (+ set summary), contact sheet PNG(s) rendered at each size on light & dark.
// Exit code: 0 clean, 1 warnings only, 2 errors.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) {
  console.log('Usage: node svgcheck.mjs <file.svg|dir> [...] [--out dir] [--sizes 16,24,32,64,256] [--set] [--optimize] [--json]');
  process.exit(0);
}
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const valued = new Set(['--out', '--sizes']);
const inputs = args.filter((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));
const outDir = resolve(opt('--out', 'svgcheck-out'));
const sizes = opt('--sizes', '16,24,32,64,256').split(',').map(Number).filter((n) => n > 0);
const asSet = args.includes('--set'), doOpt = args.includes('--optimize'), asJson = args.includes('--json');

const files = [];
for (const p of inputs) {
  const r = resolve(p);
  if (!existsSync(r)) { console.error('Not found: ' + r); continue; }
  if (statSync(r).isDirectory()) for (const f of readdirSync(r)) { if (f.toLowerCase().endsWith('.svg') && !f.endsWith('.min.svg')) files.push(join(r, f)); }
  else files.push(r);
}
if (!files.length) { console.error('No SVG files.'); process.exit(2); }
mkdirSync(outDir, { recursive: true });

// ---------- static (text) checks ----------
function staticChecks(src) {
  const issues = [];
  const add = (sev, msg) => issues.push({ sev, msg });
  if (!/<svg[\s>]/i.test(src)) add('error', 'no <svg> root element');
  if (/<script[\s>]/i.test(src)) add('error', 'contains <script> (unsafe; WordPress sanitizers will strip or reject it)');
  if (/\son[a-z]+\s*=/i.test(src)) add('error', 'contains on* event handler attributes (unsafe)');
  if (/<foreignObject/i.test(src)) add('warn', '<foreignObject> present (HTML inside SVG; often stripped by sanitizers, poor portability)');
  if (/(xlink:)?href\s*=\s*["']\s*(https?:|\/\/)/i.test(src)) add('warn', 'external href reference (loads remote resources; fails offline / blocked by sanitizers)');
  const rasters = (src.match(/<image\b[^>]*(href|xlink:href)\s*=\s*["']([^"']+)["']/gi) || []);
  if (rasters.length) add('error', `${rasters.length} embedded raster <image> element(s): this is not a true vector (${rasters.some(r => /data:image/i.test(r)) ? 'base64 data URI' : 'linked bitmap'})`);
  if (/<\?xml[^>]*encoding="(?!utf-?8)/i.test(src)) add('warn', 'non-UTF-8 encoding declared');
  const decimals = (src.match(/\d\.\d{4,}/g) || []).length;
  if (decimals > 20) add('warn', `${decimals} numbers with 4+ decimals (bloat; run --optimize)`);
  if (/<metadata|sodipodi:|inkscape:|data-name=|<!--/i.test(src)) add('info', 'editor metadata / comments present (removed by --optimize)');
  const ids = [...src.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dup.length) add('error', 'duplicate ids: ' + [...new Set(dup)].slice(0, 5).join(', '));
  const refs = [...src.matchAll(/url\(\s*#([^)\s]+)\s*\)|(?:xlink:)?href\s*=\s*["']#([^"']+)["']/g)].map((m) => m[1] || m[2]);
  const missing = [...new Set(refs.filter((r) => !ids.includes(r)))];
  if (missing.length) add('error', 'broken references (gradient/mask/clip/use target missing): #' + missing.join(', #'));
  const generic = ids.filter((i) => /^(a|b|c|[a-z]\d+|linear-gradient(-\d+)?|clip-?path-?\d*|mask-?\d*|path-?\d+)$/i.test(i));
  if (ids.length && generic.length > 2) add('info', `${generic.length} generic ids (e.g. ${generic.slice(0, 3).join(', ')}): prefix ids per asset to avoid collisions when several SVGs are inlined on one page`);
  const kb = Buffer.byteLength(src) / 1024;
  if (kb > 150) add('warn', `large file: ${kb.toFixed(0)} KB (icons should be < 2 KB, logos < 15 KB, illustrations usually < 80 KB)`);
  return { issues, kb: +kb.toFixed(1), idCount: ids.length };
}

// ---------- optimizer (conservative, text-level) ----------
function optimize(src) {
  return src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/<sodipodi:namedview[\s\S]*?(\/>|<\/sodipodi:namedview>)/gi, '')
    .replace(/\s(sodipodi|inkscape):[\w-]+="[^"]*"/gi, '')
    .replace(/\sxmlns:(sodipodi|inkscape)="[^"]*"/gi, '')
    .replace(/\sdata-name="[^"]*"/gi, '')
    .replace(/(\d+\.\d{2})\d+/g, '$1')
    .replace(/(\.\d*?[1-9])0+(?=\D)/g, '$1')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ---------- browser ----------
const browser = [process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p));
if (!browser) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }

const profile = mkdtempSync(join(tmpdir(), 'edd-svg-'));
const proc = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-extensions', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((res, rej) => { let b = ''; const t = setTimeout(() => rej(new Error('Browser did not start')), 20000); proc.stderr.on('data', (d) => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } }); });
const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const listeners = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } else listeners.forEach((l) => l(m)); });
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const mid = ++id; const to = setTimeout(() => { pending.delete(mid); rej(new Error('CDP timeout ' + method)); }, 45000); pending.set(mid, { res: (v) => { clearTimeout(to); res(v); }, rej: (e) => { clearTimeout(to); rej(e); } }); ws.send(JSON.stringify({ id: mid, method, params, ...(sessionId ? { sessionId } : {}) })); });

// In-page analysis: parse, geometry, clipping, stroke/fill census, small-size ink coverage
const ANALYZE = (svgText, renderSizes) => {
  const out = { errors: [], warns: [], info: [] };
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const pe = doc.querySelector('parsererror');
  if (pe) { out.errors.push('XML parse error: ' + pe.textContent.trim().split('\n')[0].slice(0, 160)); return out; }
  const root = doc.documentElement;
  if (root.nodeName.toLowerCase() !== 'svg') { out.errors.push('root element is <' + root.nodeName + '>'); return out; }
  if (!root.getAttribute('xmlns')) out.warns.push('missing xmlns="http://www.w3.org/2000/svg" (required when used as a standalone file / <img>)');
  const vb = root.getAttribute('viewBox');
  if (!vb) out.errors.push('missing viewBox (will not scale responsively)');
  const w = root.getAttribute('width'), h = root.getAttribute('height');
  let vbw = 0, vbh = 0, vbx = 0, vby = 0;
  if (vb) { [vbx, vby, vbw, vbh] = vb.trim().split(/[\s,]+/).map(Number); if (!(vbw > 0 && vbh > 0)) out.errors.push('invalid viewBox: ' + vb); }
  if (w && h && vbw && /^\d/.test(w) && /^\d/.test(h)) { const r1 = parseFloat(w) / parseFloat(h), r2 = vbw / vbh; if (Math.abs(r1 - r2) / r2 > 0.01) out.warns.push(`width/height ratio ${r1.toFixed(3)} differs from viewBox ratio ${r2.toFixed(3)} (distortion/letterboxing)`); }
  if (!/role|aria-|<title/i.test(svgText)) out.info.push('no <title>/role/aria: add role="img" + <title> for meaningful graphics, or aria-hidden="true" for decorative ones');
  const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:0;top:0;width:512px';
  document.body.appendChild(host); host.innerHTML = svgText;
  const svg = host.querySelector('svg'); if (!svg) { out.errors.push('could not mount'); return out; }
  if (vbw) { svg.setAttribute('width', 512); svg.setAttribute('height', 512 * vbh / vbw); }
  const shapes = svg.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon,text,use');
  out.counts = { shapes: shapes.length, paths: svg.querySelectorAll('path').length, groups: svg.querySelectorAll('g').length, gradients: svg.querySelectorAll('linearGradient,radialGradient').length, masks: svg.querySelectorAll('mask,clipPath').length, text: svg.querySelectorAll('text').length, images: svg.querySelectorAll('image').length };
  if (!shapes.length && !out.counts.images) out.errors.push('no drawable shapes');
  if (out.counts.text) out.warns.push(`${out.counts.text} <text> element(s): rendering depends on installed fonts; convert to outlines for logos/final assets`);
  // bounding box vs viewBox (accidental clipping / wasted space)
  try {
    const bb = svg.getBBox();
    if (vbw && bb.width) {
      const tol = Math.max(vbw, vbh) * 0.005;
      const clipL = bb.x < vbx - tol, clipT = bb.y < vby - tol, clipR = bb.x + bb.width > vbx + vbw + tol, clipB = bb.y + bb.height > vby + vbh + tol;
      const bleedOk = /data-edd-allow=["'][^"']*bleed/i.test(svgText);
      if ((clipL || clipT || clipR || clipB) && !bleedOk) out.warns.push(`content extends outside the viewBox (${[clipL && 'left', clipT && 'top', clipR && 'right', clipB && 'bottom'].filter(Boolean).join(', ')}): accidental clipping? (intentional edge bleed: add data-edd-allow="bleed" on <svg>)`);
      const fill = (bb.width * bb.height) / (vbw * vbh);
      out.bbox = { x: +bb.x.toFixed(2), y: +bb.y.toFixed(2), w: +bb.width.toFixed(2), h: +bb.height.toFixed(2), fillRatio: +fill.toFixed(2) };
      const padL = bb.x - vbx, padR = vbx + vbw - (bb.x + bb.width), padT = bb.y - vby, padB = vby + vbh - (bb.y + bb.height);
      out.padding = [padT, padR, padB, padL].map((v) => +v.toFixed(2));
      if (Math.abs(padL - padR) > vbw * 0.04 || Math.abs(padT - padB) > vbh * 0.04) out.info.push(`content not centered in viewBox (pad T/R/B/L ${out.padding.join('/')})`);
    }
  } catch {}
  // stroke / fill census (for icon consistency)
  const sw = new Map(), caps = new Set(), joins = new Set(); let stroked = 0, filled = 0;
  for (const el of shapes) {
    const cs = getComputedStyle(el);
    if (cs.stroke && cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0) { stroked++; const v = (+parseFloat(cs.strokeWidth).toFixed(2)); sw.set(v, (sw.get(v) || 0) + 1); caps.add(cs.strokeLinecap); joins.add(cs.strokeLinejoin); }
    if (cs.fill && cs.fill !== 'none' && cs.fillOpacity !== '0') filled++;
  }
  out.style = { strokeWidths: [...sw.keys()], caps: [...caps], joins: [...joins], stroked, filled, nonScaling: !!svg.querySelector('[vector-effect="non-scaling-stroke"]'), currentColor: /currentColor/i.test(svgText) };
  // render-based ink coverage at small sizes (legibility proxy)
  const img = new Image(); const blob = new Blob([svgText], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob);
  return new Promise((res) => {
    img.onload = () => {
      out.coverage = {};
      for (const s of renderSizes.filter((n) => n <= 64)) {
        const c = document.createElement('canvas'); const hh = vbw ? Math.max(1, Math.round(s * vbh / vbw)) : s; c.width = s; c.height = hh;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0, s, hh);
        const d = x.getImageData(0, 0, s, hh).data; let ink = 0, partial = 0;
        for (let i = 3; i < d.length; i += 4) { if (d[i] > 200) ink++; else if (d[i] > 20) partial++; }
        out.coverage[s] = { ink: +(ink / (s * hh)).toFixed(3), antialiasShare: +(partial / Math.max(1, ink + partial)).toFixed(2) };
      }
      const c16 = out.coverage[16] || out.coverage[Math.min(...Object.keys(out.coverage).map(Number))];
      const lineArt = out.style && out.style.stroked && !out.style.filled;
      if (c16 && c16.antialiasShare > (lineArt ? 0.85 : 0.7)) (lineArt ? out.info : out.warns).push(`at ${16}px most pixels are anti-aliased (${Math.round(c16.antialiasShare * 100)}%): strokes/details may be too thin or off-grid for small sizes`);
      URL.revokeObjectURL(url); host.remove(); res(out);
    };
    img.onerror = () => { out.errors.push('browser failed to render as <img> (invalid standalone SVG?)'); host.remove(); res(out); };
    img.src = url;
  });
};

const results = [];
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Runtime.enable', {}, sessionId);
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const st = staticChecks(src);
    const { result } = await send('Runtime.evaluate', { expression: `(${ANALYZE})(${JSON.stringify(src)}, ${JSON.stringify(sizes)})`, awaitPromise: true, returnByValue: true }, sessionId);
    const a = result.value || { errors: ['analysis failed'], warns: [], info: [] };
    const errors = [...st.issues.filter((i) => i.sev === 'error').map((i) => i.msg), ...a.errors];
    const warns = [...st.issues.filter((i) => i.sev === 'warn').map((i) => i.msg), ...a.warns];
    const info = [...st.issues.filter((i) => i.sev === 'info').map((i) => i.msg), ...a.info];
    const r = { file: f, name: basename(f), kb: st.kb, counts: a.counts, bbox: a.bbox, style: a.style, coverage: a.coverage, errors, warns, info };
    if (doOpt && !errors.some((e) => /parse error/.test(e))) { const o = optimize(src); const of = join(outDir, basename(f, '.svg') + '.min.svg'); writeFileSync(of, o); r.optimized = { file: of, kb: +(Buffer.byteLength(o) / 1024).toFixed(1) }; }
    results.push(r);
  }
  // contact sheet: each file at each size, on light and dark
  const cell = (s) => Math.max(s, 40) + 20;
  const sheetHtml = `<!doctype html><html><body style="margin:0;font:12px system-ui;background:#fff">${results.map((r) => {
    const src = readFileSync(r.file, 'utf8');
    // <img> can't inherit color, so currentColor is resolved per row (ink on light, white on dark)
    const b64 = (fg) => Buffer.from(src.replace(/currentColor/gi, fg)).toString('base64');
    const row = (bg, fg) => { const d = b64(fg); return `<div style="display:flex;align-items:center;gap:0;background:${bg};color:${fg}">${sizes.map((s) => `<div style="width:${cell(s)}px;height:${cell(s)}px;display:grid;place-items:center"><img src="data:image/svg+xml;base64,${d}" width="${s}" style="max-height:${s}px"></div>`).join('')}</div>`; };
    return `<div style="padding:8px 10px;border-bottom:1px solid #ddd"><b>${r.name}</b> <span style="color:#666">${r.kb} KB · ${sizes.join('/')}px</span>${row('#ffffff', '#0F172A')}${row('#0F172A', '#ffffff')}</div>`;
  }).join('')}</body></html>`;
  const sheetFile = join(outDir, 'contact-sheet.html'); writeFileSync(sheetFile, sheetHtml);
  const w = Math.min(4000, sizes.reduce((t, s) => t + cell(s), 40));
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 1, mobile: false }, sessionId);
  await send('Page.enable', {}, sessionId);
  const loaded = new Promise((r) => { const l = (m) => { if (m.method === 'Page.loadEventFired') { listeners.splice(listeners.indexOf(l), 1); r(); } }; listeners.push(l); setTimeout(r, 15000); });
  await send('Page.navigate', { url: 'file:///' + sheetFile.replace(/\\/g, '/') }, sessionId); await loaded; await new Promise((r) => setTimeout(r, 400));
  const { result: hres } = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true }, sessionId);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: Math.min(hres.value, 16000), scale: 1 }, captureBeyondViewport: true }, sessionId);
  const png = join(outDir, 'contact-sheet.png'); writeFileSync(png, Buffer.from(shot.data, 'base64'));
  var sheetPng = png;
} finally { try { await send('Browser.close'); } catch {} proc.kill(); setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch {} }, 500); }

// ---------- set consistency ----------
let setReport = null;
if (asSet && results.length > 1) {
  const vbs = new Set(results.map((r) => readFileSync(r.file, 'utf8').match(/viewBox="([^"]+)"/)?.[1] || 'none'));
  const sws = new Set(results.flatMap((r) => r.style?.strokeWidths || []));
  const caps = new Set(results.flatMap((r) => r.style?.caps || [])), joins = new Set(results.flatMap((r) => r.style?.joins || []));
  const mode = (r) => (r.style?.stroked && !r.style?.filled ? 'outline' : r.style?.filled && !r.style?.stroked ? 'filled' : 'mixed');
  const modes = new Set(results.map(mode));
  const inks = results.map((r) => r.coverage?.[24]?.ink).filter((v) => v != null);
  const mean = inks.reduce((a, b) => a + b, 0) / Math.max(1, inks.length);
  const outliers = results.filter((r) => r.coverage?.[24] && Math.abs(r.coverage[24].ink - mean) > Math.max(0.06, mean * 0.45)).map((r) => `${r.name} (${r.coverage[24].ink})`);
  setReport = {
    viewBoxes: [...vbs], strokeWidths: [...sws], caps: [...caps], joins: [...joins], modes: [...modes], meanInk24: +mean.toFixed(3), weightOutliers: outliers,
    problems: [vbs.size > 1 && 'mixed viewBoxes', sws.size > 1 && 'mixed stroke widths', caps.size > 1 && 'mixed linecaps', joins.size > 1 && 'mixed linejoins', modes.size > 1 && 'mixed outline/filled styles', outliers.length && 'visual weight outliers: ' + outliers.join(', '), results.some((r) => !r.style?.currentColor) && 'some icons do not use currentColor (hard-coded colors)'].filter(Boolean),
  };
}

if (asJson) console.log(JSON.stringify({ results, set: setReport, contactSheet: sheetPng }, null, 2));
else {
  for (const r of results) {
    const c = r.counts || {};
    console.log(`${r.errors.length ? 'FAIL' : r.warns.length ? 'WARN' : 'OK  '} ${r.name}  ${r.kb}KB  shapes:${c.shapes ?? '?'} paths:${c.paths ?? '?'} groups:${c.groups ?? '?'} grad:${c.gradients ?? 0} mask/clip:${c.masks ?? 0} raster:${c.images ?? 0}${r.style ? `  stroke:${r.style.strokeWidths.join('/') || '-'} fill-els:${r.style.filled}` : ''}${r.optimized ? `  → ${basename(r.optimized.file)} ${r.optimized.kb}KB` : ''}`);
    for (const e of r.errors) console.log('   ✖ ' + e);
    for (const w of r.warns) console.log('   ! ' + w);
    for (const i of r.info.slice(0, 3)) console.log('   · ' + i);
  }
  if (setReport) console.log(`\nSET: viewBox ${setReport.viewBoxes.join(' | ')} · stroke ${setReport.strokeWidths.join('/') || '-'} · caps ${setReport.caps.join('/') || '-'} · style ${setReport.modes.join('/')} · mean ink@24 ${setReport.meanInk24}\n  ${setReport.problems.length ? 'problems: ' + setReport.problems.join('; ') : 'consistent'}`);
  console.log(`\ncontact sheet: ${sheetPng}`);
}
process.exitCode = results.some((r) => r.errors.length) ? 2 : results.some((r) => r.warns.length) || setReport?.problems.length ? 1 : 0;
