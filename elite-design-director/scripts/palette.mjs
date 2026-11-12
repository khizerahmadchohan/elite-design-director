#!/usr/bin/env node
// elite-design-director / palette.mjs
// OKLCH palette builder: anchor ramp, tinted neutrals, semantic roles and a WCAG 2 contrast
// table. No dependencies (Node >= 22). Original implementation of the published OKLab math.
//
// Usage: node palette.mjs <anchorHex|hueDeg> [--strategy restrained|committed|full|drenched]
//                         [--name brand] [--json] [--css] [--elementor]

const args = process.argv.slice(2);
const HELP = `Usage: node palette.mjs <anchorHex|hueDeg> [options]
  --neutral anchor|cool|pure|<hue>  neutral/ground hue (default: warm anchors get near-neutral grounds, avoiding cream)
  <anchorHex>   e.g. #E8590C or E8590C;  <hueDeg> e.g. 172 (builds an anchor at L 0.55, C 0.14)
  --strategy    restrained (default) | committed | full | drenched  (how much color the surfaces carry)
  --name        token prefix (default "brand")
  --css         print a :root block of custom properties
  --elementor   print role -> suggested Elementor Global Color names
  --json        print full JSON
  -h, --help    this help`;
if (!args.length || args.includes('-h') || args.includes('--help')) { console.log(HELP); process.exit(0); }
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const valued = new Set(['--strategy', '--name']);
const input = args.find((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));
const strategy = opt('--strategy', 'restrained');
if (!['restrained', 'committed', 'full', 'drenched'].includes(strategy)) { console.error('Unknown --strategy ' + strategy); process.exit(2); }
const name = opt('--name', 'brand').replace(/[^a-z0-9-]/gi, '-').toLowerCase();

// ---------- color math ----------
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexToRgb(h) {
  let s = h.replace('#', '').trim();
  if (s.length === 3) s = [...s].map((x) => x + x).join('');
  if (!/^[0-9a-f]{6}$/i.test(s)) return null;
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
}
const rgbToHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
function rgbToOklab([r, g, b]) {
  const R = toLin(r), G = toLin(g), B = toLin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const toOklch = (rgb) => { const [L, a, b] = rgbToOklab(rgb); return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 }; };
const inGamut = (lin) => lin.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
// OKLCH -> hex, reducing chroma (binary search) until inside sRGB
function oklch(L, C, H) {
  const h = (H * Math.PI) / 180;
  const lab = (c) => [L, c * Math.cos(h), c * Math.sin(h)];
  let c = C;
  if (!inGamut(oklabToLinear(lab(c)))) {
    let lo = 0, hi = C;
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (inGamut(oklabToLinear(lab(mid)))) lo = mid; else hi = mid; }
    c = lo;
  }
  const hex = rgbToHex(oklabToLinear(lab(c)).map((x) => toGam(Math.min(1, Math.max(0, x)))));
  return { hex, L: +L.toFixed(3), C: +c.toFixed(3), H: +H.toFixed(1), css: `oklch(${(L * 100).toFixed(1)}% ${c.toFixed(3)} ${H.toFixed(1)})` };
}
const lum = (hex) => { const [r, g, b] = hexToRgb(hex).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// ---------- anchor ----------
let anchor;
if (/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(input || '')) {
  const hex = rgbToHex(hexToRgb(input));
  const o = toOklch(hexToRgb(hex));
  anchor = { hex, L: +o.L.toFixed(3), C: +o.C.toFixed(3), H: +o.H.toFixed(1), css: `oklch(${(o.L * 100).toFixed(1)}% ${o.C.toFixed(3)} ${o.H.toFixed(1)})` };
} else if (input && Number.isFinite(Number(input))) {
  anchor = oklch(0.55, 0.14, ((Number(input) % 360) + 360) % 360);
} else { console.error('Anchor must be a hex color or a hue in degrees.\n' + HELP); process.exit(2); }
const H = anchor.H, C0 = Math.max(anchor.C, 0.02);

// ---------- ramps ----------
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const Ls = [0.97, 0.93, 0.86, 0.78, 0.69, 0.6, 0.51, 0.42, 0.32, 0.2];
// chroma tapers toward both ends (sine envelope peaking mid-ramp)
const ramp = STEPS.map((s, i) => { const t = Math.sin(Math.PI * (0.08 + 0.84 * (i / 9))); return { step: s, ...oklch(Ls[i], C0 * (0.25 + 0.75 * t), H) }; });
const nC = { restrained: [0.005, 0.008], committed: [0.008, 0.012], full: [0.012, 0.016], drenched: [0.016, 0.02] }[strategy];
// Neutral hue: avoid the "tasteful default" (cream canvas) that a warm anchor would otherwise produce.
const nArg = (() => { const i = process.argv.indexOf('--neutral'); return i > 0 ? process.argv[i + 1] : null; })();
const warm = H >= 20 && H <= 110;
let NH = H, canvasCap = 1;
if (nArg === 'cool') NH = 250; else if (nArg === 'pure') { NH = H; canvasCap = 0; } else if (nArg && Number.isFinite(Number(nArg))) NH = Number(nArg); else if (nArg === 'anchor') NH = H;
else if (warm) canvasCap = 0.004; // default for warm anchors: near-neutral grounds, not cream
const capC = (c, L) => (L >= 0.9 ? Math.min(c, canvasCap === 0 ? 0 : canvasCap === 1 ? c : canvasCap) : c);
const neutral = STEPS.map((s, i) => { const L = Ls[i] + (i === 0 ? 0.015 : 0); return { step: s, ...oklch(L, capC(i < 2 || i > 7 ? nC[0] : nC[1], L), NH) }; });
const N = Object.fromEntries(neutral.map((x) => [x.step, x.hex]));
const R = Object.fromEntries(ramp.map((x) => [x.step, x.hex]));

// ---------- roles ----------
const surfaces = {
  restrained: { canvas: oklch(0.985, capC(nC[0], 0.985), NH).hex, s1: oklch(0.96, capC(nC[0], 0.96), NH).hex, s2: N[100], border: N[200] },
  committed: { canvas: oklch(0.98, capC(0.012, 0.98), NH).hex, s1: oklch(0.96, capC(0.018, 0.96), NH).hex, s2: oklch(0.93, capC(0.024, 0.93), NH).hex, border: oklch(0.86, 0.03, H).hex },
  full: { canvas: oklch(0.97, 0.025, H).hex, s1: R[100], s2: R[200], border: R[300] },
  drenched: { canvas: R[50], s1: R[100], s2: R[200], border: R[300] },
}[strategy];
const ink = oklch(0.2, Math.min(0.025, C0 * 0.2), H).hex;
const pickOn = (fill) => (contrast(fill, '#FFFFFF') >= contrast(fill, ink) ? '#FFFFFF' : ink);
// darkest-enough primary: keep the anchor as fill, use a darker step for hover/active
const primary = anchor.hex;
const sem = (h, c) => { const fill = oklch(0.55, c, h).hex; return { fill, on: pickOn(fill), text: oklch(0.45, c, h).hex }; };
const S = { success: sem(150, 0.14), warning: sem(75, 0.15), danger: sem(27, 0.19), info: sem(250, 0.13) };
// warning reads better as a bright fill with dark text
S.warning.fill = oklch(0.8, 0.16, 80).hex; S.warning.on = pickOn(S.warning.fill); S.warning.text = oklch(0.5, 0.12, 70).hex;
const darker = (hex, dL) => { const o = toOklch(hexToRgb(hex)); return oklch(Math.min(0.97, Math.max(0.1, o.L - dL)), o.C, o.H).hex; };
const roles = {
  canvas: surfaces.canvas, 'surface-1': surfaces.s1, 'surface-2': surfaces.s2, border: surfaces.border,
  ink, 'ink-secondary': N[700], 'ink-muted': N[600],
  primary, 'primary-hover': darker(primary, pickOn(primary) === '#FFFFFF' ? 0.06 : -0.05), 'primary-active': darker(primary, pickOn(primary) === '#FFFFFF' ? 0.12 : -0.09), 'on-primary': pickOn(primary),
  'focus-ring': R[600],
  success: S.success.fill, 'on-success': S.success.on, warning: S.warning.fill, 'on-warning': S.warning.on,
  danger: S.danger.fill, 'on-danger': S.danger.on, info: S.info.fill, 'on-info': S.info.on,
};

// ---------- contrast table ----------
const pairs = [];
const add = (fg, bg, kind) => { const r = contrast(roles[fg] || fg, roles[bg] || bg); const need = kind === 'text' ? 4.5 : 3; pairs.push({ fg, bg, kind, ratio: +r.toFixed(2), need, pass: r >= need, largeOk: r >= 3 }); };
for (const bg of ['canvas', 'surface-1', 'surface-2']) for (const fg of ['ink', 'ink-secondary', 'ink-muted', 'primary']) add(fg, bg, 'text');
for (const f of ['primary', 'primary-hover', 'primary-active', 'success', 'warning', 'danger', 'info']) add(f === 'primary-hover' || f === 'primary-active' ? 'on-primary' : 'on-' + f, f, 'text');
add('focus-ring', 'canvas', 'ui'); add('border', 'canvas', 'ui-decorative'); add('primary', 'canvas', 'ui');
pairs.at(-2).need = 1; pairs.at(-2).pass = true; // decorative borders are exempt; listed for reference

const anchorOnCanvas = contrast(primary, roles.canvas);
const notes = [];
if (anchorOnCanvas < 4.5) {
  const ok = ramp.find((x) => contrast(x.hex, roles.canvas) >= 4.5);
  notes.push(`Anchor ${primary} fails as body text on canvas (${anchorOnCanvas.toFixed(2)}:1${anchorOnCanvas >= 3 ? ', OK for large text/UI' : ''}). Lightest ramp step passing 4.5: ${ok ? ok.step + ' ' + ok.hex + ' (' + contrast(ok.hex, roles.canvas).toFixed(2) + ':1)' : 'none'}; use the anchor as a fill with on-primary text (${roles['on-primary']}, ${contrast(roles['on-primary'], primary).toFixed(2)}:1).`);
  if (ok) roles['primary-text'] = ok.hex;
}
const fails = pairs.filter((p) => !p.pass);

if (warm && !nArg) notes.push('Warm anchor: grounds kept near-neutral to avoid the cream "tasteful default". Use --neutral anchor only if a warm ground is a deliberate brand choice; --neutral cool|pure|<hue> also available.');
const out = { input, anchor, strategy, name, ramp, neutral, roles, contrast: pairs, notes };
if (args.includes('--json')) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }

const ELEMENTOR = { canvas: 'Background', 'surface-1': 'Surface', 'surface-2': 'Surface Alt', border: 'Border', ink: 'Text', 'ink-secondary': 'Text Secondary', 'ink-muted': 'Text Muted', primary: 'Primary', 'primary-hover': 'Primary Hover', 'primary-active': 'Primary Active', 'on-primary': 'On Primary', 'primary-text': 'Primary Text', 'focus-ring': 'Focus', success: 'Success', 'on-success': 'On Success', warning: 'Warning', 'on-warning': 'On Warning', danger: 'Danger', 'on-danger': 'On Danger', info: 'Info', 'on-info': 'On Info' };

console.log(`palette ${name}: anchor ${anchor.hex} ${anchor.css} | strategy ${strategy}`);
console.log('ramp    ' + ramp.map((x) => `${x.step}:${x.hex}`).join(' '));
console.log('neutral ' + neutral.map((x) => `${x.step}:${x.hex}`).join(' '));
console.log('roles   ' + Object.entries(roles).map(([k, v]) => `${k}=${v}`).join(' '));
console.log(`contrast: ${pairs.length - fails.length}/${pairs.length} pass` + (fails.length ? ' | FAIL: ' + fails.map((p) => `${p.fg}/${p.bg} ${p.ratio}${p.largeOk ? '(large ok)' : ''}`).join(', ') : ''));
for (const p of pairs) if (!args.includes('--css') && !args.includes('--elementor')) console.log(`  ${p.pass ? 'PASS' : 'FAIL'} ${p.ratio.toFixed(2).padStart(5)}  ${p.fg} on ${p.bg} (${p.kind}, need ${p.need})`);
for (const n of notes) console.log('note: ' + n);
if (args.includes('--css')) {
  console.log(':root {');
  for (const x of ramp) console.log(`  --${name}-${x.step}: ${x.hex}; /* ${x.css} */`);
  for (const x of neutral) console.log(`  --neutral-${x.step}: ${x.hex};`);
  for (const [k, v] of Object.entries(roles)) console.log(`  --color-${k}: ${v};`);
  console.log('}');
}
if (args.includes('--elementor')) {
  console.log('Elementor Global Colors (Site Settings > Global Colors):');
  for (const [k, v] of Object.entries(roles)) console.log(`  ${(ELEMENTOR[k] || k).padEnd(16)} ${v}  <- ${k}${['primary', 'ink-secondary', 'primary-hover'].includes(k) ? '' : ''}`);
  console.log('  System slots: Primary=primary, Secondary=ink-secondary, Text=ink, Accent=primary-hover');
}
