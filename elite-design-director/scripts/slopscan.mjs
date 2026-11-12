#!/usr/bin/env node
// elite-design-director / slopscan.mjs
// Static, advisory scan of HTML / CSS / JSX / TSX / Vue / Svelte / PHP / Liquid files for
// generic-UI tells and common craft errors. No dependencies. Regex-based: expect false
// positives; a human/agent must judge each finding. Original implementation.
//
// Usage: node slopscan.mjs <file-or-dir> [...more] [--json]
// Exit code: 0 = no findings, 2 = findings.
// Ignore: a line containing "edd-ignore" skips findings on that line; "edd-ignore-next-line"
// skips the next line (any comment syntax). Ignored findings are counted as "waived".
// Vibe score: sum of weights of DISTINCT tells (weights loosely follow how often people name each
// tell when calling a site "AI-made"). One tell alone proves nothing; a cluster of >= 3
// distinct medium/high tells (weight >= 1) is what reads as generated.

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const roots = args.filter((a) => !a.startsWith('--'));
if (!roots.length || args.includes('--help') || args.includes('-h')) { console.log('Usage: node slopscan.mjs <file-or-dir> [...] [--json]\n  --json  full JSON (findings with weights, vibe score)\n  Inline waivers: "edd-ignore" (same line), "edd-ignore-next-line".'); process.exit(0); }

const EXT = new Set(['.html', '.htm', '.css', '.scss', '.jsx', '.tsx', '.js', '.ts', '.mjs', '.cjs', '.vue', '.svelte', '.astro', '.php', '.liquid', '.mdx']);
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'vendor', 'coverage', '.cache', 'wp-includes', 'wp-admin']);

function walk(p, acc) {
  let s; try { s = statSync(p); } catch { return acc; }
  if (s.isDirectory()) { for (const f of readdirSync(p)) if (!SKIP.has(f)) walk(join(p, f), acc); }
  else if (EXT.has(extname(p).toLowerCase()) && s.size < 2_000_000 && !/\.min\./.test(p)) acc.push(p);
  return acc;
}

const FONTS = ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans', 'Lato', 'Raleway', 'Nunito', 'Work Sans', 'Space Grotesk', 'Space Mono', 'Plus Jakarta Sans', 'DM Sans', 'DM Serif', 'Outfit', 'Syne', 'Geist', 'Instrument Sans', 'Instrument Serif', 'Playfair Display', 'Fraunces', 'Cormorant', 'Lora', 'Newsreader'];
// [id, category, severity, regex, message]   severity also: low (weak tell)
// severity: gate (likely hard-gate failure) | tell (generic-UI pattern, needs a reason) | craft (quality issue)
const RULES = [
  ['zoom-disabled', 'a11y', 'gate', /user-scalable\s*=\s*["']?no|maximum-scale\s*=\s*["']?1(\.0)?\b/gi, 'Viewport disables zoom (WCAG 1.4.4). Remove.'],
  ['outline-none', 'a11y', 'gate', /outline\s*:\s*(none|0)\b|\boutline-none\b|focus:outline-none/gi, 'Focus outline removed. Ensure a visible :focus-visible replacement exists.'],
  ['div-onclick', 'a11y', 'gate', /<(div|span)[^>]*\sonClick=/gi, 'Clickable div/span. Use <button> or <a>.'],
  ['img-no-alt', 'a11y', 'gate', /<img(?![^>]*\balt=)[^>]*>/gi, 'Image without alt attribute.'],
  ['transition-all', 'motion', 'craft', /transition\s*:\s*all\b|\btransition-all\b/gi, 'transition: all. List explicit properties.'],
  ['animate-layout-prop', 'motion', 'craft', /transition(-property)?\s*:[^;{}]*\b(width|height|top|left|margin|padding)\b/gi, 'Transitioning layout properties. Prefer transform/opacity.'],
  ['bounce-easing', 'motion', 'tell', /cubic-bezier\([^)]*-\d|cubic-bezier\([^)]*,\s*1\.[1-9]|\banimate-bounce\b|easeOutBack|elastic/gi, 'Bounce/elastic/overshoot easing on UI.'],
  ['pulse-ping', 'motion', 'tell', /\banimate-(pulse|ping)\b|@keyframes\s+pulse/gi, 'Pulsing/ping animation. Only for genuinely live status.'],
  ['hover-scale', 'motion', 'tell', /hover:scale-|:hover[^{]*\{[^}]*transform\s*:\s*scale\(1\.[0-9]/gi, 'Hover scale-up. Prefer container feedback; needs a reason.'],
  ['no-reduced-motion', 'motion', 'craft', null, 'Animations/transitions present but no prefers-reduced-motion handling found in this file.'],
  ['gradient-text', 'color', 'tell', /background-clip\s*:\s*text|\bbg-clip-text\b|-webkit-text-fill-color\s*:\s*transparent/gi, 'Gradient-filled text.'],
  ['ai-gradient', 'color', 'tell', /\b(from|via|to)-(purple|violet|fuchsia|indigo|pink)-\d{3}\b|linear-gradient\([^)]*(#(7c3aed|8b5cf6|a855f7|6366f1|9333ea|ec4899|d946ef))/gi, 'Purple/violet/pink gradient: a common generated default.'],
  ['glow-shadow', 'color', 'tell', /box-shadow\s*:\s*0\s+0\s+\d+px[^;]*(rgba?\((?!0,\s*0,\s*0)|#[0-9a-f]{3,8})|shadow-\w+-500\/\d+|drop-shadow-\[0_0/gi, 'Zero-offset colored glow shadow.'],
  ['glassmorphism', 'color', 'low', /backdrop-filter\s*:\s*blur|\bbackdrop-blur(-\w+)?\b/gi, 'Backdrop blur / glass. Use only over real moving content.'],
  ['raw-hex-in-component', 'system', 'craft', /(?<![\w-])(color|background(-color|-image)?|border(-color)?|fill|stroke)\s*:[^;{}]*?#[0-9a-f]{3,8}\b/gi, 'Raw hex color outside a token definition. Use a token.'],
  ['overused-font', 'type', 'tell', new RegExp('font-family\\s*:\\s*["\']?(' + FONTS.join('|') + ')\\b|family=(' + FONTS.map((f) => f.replace(/ /g, '\\+')).join('|') + ')\\b|\\bfont-(inter|poppins|geist|roboto)\\b', 'gi'), 'Frequently-defaulted font. Fine in app UI; on marketing pages state the reason.'],
  ['eyebrow-label', 'type', 'tell', /\buppercase\b[^"'\n]{0,80}\btracking-(widest|wider|\[0\.[2-9])|text-transform\s*:\s*uppercase[^}]{0,120}letter-spacing\s*:\s*0?\.[1-9]\d*em/gi, 'Tracked uppercase micro-label (eyebrow/kicker pattern).'],
  ['tiny-text', 'type', 'craft', /font-size\s*:\s*(([0-9]|1[01])(\.\d+)?px|0?\.(?:[0-6]\d*|7[0-4]?\d*?)rem\b)|\btext-\[(\d|1[01])px\]/gi, 'Text under 12px.'],
  ['extreme-tracking', 'type', 'craft', /letter-spacing\s*:\s*-0?\.(0[6-9]|[1-9])\d*em|tracking-\[-0\.(0[6-9]|[1-9])/gi, 'Letter-spacing tighter than -0.05em.'],
  ['nested-card-hint', 'layout', 'tell', /class(Name)?=["'][^"']*\bcard\b[^"']*["'][^<]*<[^>]*class(Name)?=["'][^"']*\bcard\b/gi, 'Possible card nested inside card.'],
  ['side-stripe', 'layout', 'tell', /border-left\s*:\s*([3-9]|\d{2})px\s+solid|\bborder-l-(4|8)\b/gi, 'Thick colored side stripe (common on rounded cards/callouts).'],
  ['vh-unit', 'responsive', 'craft', /(?<![sd])\b100vh\b|\bh-screen\b|\bmin-h-screen\b/gi, '100vh on mobile is unreliable. Use svh/dvh.'],
  ['vw-width', 'responsive', 'craft', /width\s*:\s*100vw|\bw-screen\b/gi, '100vw includes the scrollbar and causes horizontal overflow.'],
  ['z-index-huge', 'system', 'craft', /z-index\s*:\s*\d{4,}|\bz-\[\d{4,}\]/gi, 'Arbitrary huge z-index. Use the layered scale.'],
  ['important', 'system', 'craft', /!important/g, '!important usage (count). Justify each.'],
  ['emoji-icon', 'icons', 'tell', /<(h[1-6]|button|li|span|a|div|p|i)[^>]*>\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/giu, 'Emoji used as an icon in a heading/control.'],
  ['fake-window-chrome', 'imagery', 'tell', /(traffic|window)-?(light|dot)s?|\b(bg-red-400|bg-red-500)[^"']*["'][^<]{0,80}<[^>]*(bg-yellow-400|bg-amber-400)/gi, 'Drawn browser/window traffic-light dots around a mock.'],
  ['hype-copy', 'copy', 'tell', /\b(seamless(ly)?|elevate(s|d)?|empower(s|ed|ing)?|unlock(s|ing)?|supercharge|revolutioni[sz]e|cutting[- ]edge|next[- ]gen(eration)?|world[- ]class|game[- ]chang(er|ing)|best[- ]in[- ]class|robust|leverage|delve|tapestry|effortless(ly)?|state[- ]of[- ]the[- ]art|unleash|harness the power)\b/gi, 'Hype vocabulary. Replace with a concrete fact.'],
  ['stock-phrases', 'copy', 'tell', /whether you['’]re|take (it|your \w+) to the next level|look no further|in today['’]s (fast-paced|digital)|we['’]ve got you covered|reimagined\b/gi, 'Stock copy phrase.'],
  ['stock-cta', 'copy', 'tell', />\s*(Get Started|Learn More|Click Here|Submit|Read More)\s*</gi, 'Generic CTA label. Use verb + object.'],
  ['fake-proof', 'copy', 'gate', /trusted by\s+[\d,.]+\s*\+|[\d,.]+\s*\+\s*(happy )?(customers|clients|users|teams|businesses|restaurants)|\b99\.9+%|★★★★★|lorem ipsum/gi, 'Possibly invented proof/placeholder. Verify it is real and sourced.'],
  ['testimonial-check', 'copy', 'gate', /class(Name)?=["'][^"']*\b(testimonial|review|quote-card)s?\b|<blockquote\b|\b(trusted by|as seen (in|on)|used by teams at|loved by)\b/gi, 'Testimonials/logo strip: confirm each is real, attributable and permitted; otherwise replace with a labeled placeholder.'],
  ['hidden-at-rest', 'motion', 'gate', /\.(reveal|fade|fade-up|fade-in|animate|aos|in-view|scroll-reveal)[\w-]*\s*\{[^}]*opacity\s*:\s*0\b|\[data-aos[^\]]*\][^{]*\{[^}]*opacity\s*:\s*0\b|\bopacity-0\b/gi, 'Content starts at opacity 0. Make sure it is visible without JS and under reduced motion.'],
  ['ease-in', 'motion', 'craft', /\bease-in\b(?!-out)|cubic-bezier\(\s*0?\.\d+\s*,\s*0\s*,\s*1\s*,\s*1\s*\)/gi, 'ease-in on UI delays the moment the user watches. Use ease-out.'],
  ['meta-dot-string', 'copy', 'tell', />[^<>]*?\S\s*(·|&middot;|&#183;)\s*[^<>·]*?\S\s*(·|&middot;|&#183;)\s*\S[^<>]*</g, 'Middle-dot meta string ("A · B · C"): a generated-layout cadence.'],
  ['arrow-cta', 'copy', 'tell', />[^<>]{1,48}?\s*(→|&rarr;|-&gt;|->)\s*<\/(a|button|span)>/g, 'CTA label ending in an arrow. Fine once; as a system it reads templated.'],
  ['icon-tile', 'layout', 'tell', /rounded-(lg|xl|2xl|full)\b[^"'>]*\bbg-[\w/-]+[^>]*>\s*(<svg|<i\b|<[\w.-]*(Icon|lucide)|<span[^>]*lucide)(?=[\s\S]{0,500}<h[2-6])|\blucide\b[^>]*>(?=[\s\S]{0,300}<h[2-6])/gi, 'Icon in a rounded tinted tile above a heading (feature-card kit).'],
  ['centered-hero', 'layout', 'tell', /<(section|header|div)[^>]*class(Name)?=["'][^"']*\btext-center\b[^"']*["'][\s\S]{0,1500}?\bmax-w-[\s\S]{0,1500}?<(a|button)\b[\s\S]{0,500}?<(a|button)\b|\.hero[\w-]*\s*\{[^}]*text-align\s*:\s*center/gi, 'Centered hero with constrained copy and two buttons: the default landing hero.'],
  ['shadcn-default', 'system', 'tell', /rounded-xl border bg-card text-card-foreground shadow|\b(bg-background|text-muted-foreground|border-border)\b/g, 'Stock shadcn/ui tokens and card recipe, unchanged.'],
];
const WEIGHT = { 'shadcn-default': 1, 'ai-gradient': 3, 'gradient-text': 3, 'glow-shadow': 2, 'hidden-at-rest': 1.5, 'tasteful-default': 2, 'acid-on-black': 1.5, 'uniform-radius': 1, 'emoji-icon': 1.5, 'overused-font': 1, 'icon-tile': 1, 'centered-hero': 1, 'meta-dot-string': 1, 'hype-copy': 1, 'stock-phrases': 1, 'fake-window-chrome': 1, 'arrow-cta': 0.5, 'stock-cta': 0.5, 'bounce-easing': 0.5, 'pulse-ping': 0.5, 'hover-scale': 0.5, 'eyebrow-label': 0.5, 'nested-card-hint': 0.5, 'side-stripe': 0.5, 'glassmorphism': 0.5, 'em-dash-cadence': 0.5 };
const COPY = new Set(['hype-copy', 'stock-phrases', 'stock-cta', 'fake-proof', 'testimonial-check', 'meta-dot-string', 'arrow-cta']);
const hexRgb = (h) => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const hsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; if (!d) return [0, 0, l]; const s = d / (1 - Math.abs(2 * l - 1)); const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, s, l]; };
const near = (a, b, t = 40) => { const x = hexRgb(a), y = hexRgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) < t; };
const project = { bgs: [], hexes: [], serif: null, radius: {}, ruleLine: {} };

const files = roots.flatMap((r) => walk(r, []));
const findings = [];
let emDash = 0; let waived = 0;

const baseOf = (f) => { for (const r of roots) { const rel = relative(r, f); if (!rel.startsWith('..')) return rel || f.split(/[\\/]/).pop(); } return f; };
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const shown = baseOf(f);
  const rmBlocks = [...src.matchAll(/@media[^{]*prefers-reduced-motion[^{]*\{/g)].map((m) => { let d = 0, i = m.index + m[0].length - 1; for (; i < src.length; i++) { if (src[i] === '{') d++; else if (src[i] === '}' && --d === 0) break; } return [m.index, i]; });
  const inReduced = (i) => rmBlocks.some(([a, b]) => i >= a && i <= b);
  const lines = src.split(/\r?\n/);
  const lineOf = (idx) => src.slice(0, idx).split(/\r?\n/).length;
  const ext = extname(f).toLowerCase();
  const ignored = new Set();
  lines.forEach((t, i) => { if (/edd-ignore-next-line/.test(t)) ignored.add(i + 2); else if (/edd-ignore/.test(t)) ignored.add(i + 1); });
  const isScript = /\.(m?js|cjs|ts)$/.test(ext);
  const push = (x) => { if (ignored.has(x.line)) { waived++; return; } findings.push(x); };
  for (const m of src.matchAll(/(?:background(?:-color)?\s*:\s*|bg-\[|--[\w-]*(?:bg|background|canvas|paper|surface|cream|base|ground)[\w-]*\s*:\s*)(#[0-9a-f]{6}\b|#[0-9a-f]{3}\b)/gi)) if (!ignored.has(lineOf(m.index))) project.bgs.push([m[1], shown, lineOf(m.index)]);
  for (const m of src.matchAll(/#[0-9a-f]{6}\b/gi)) if (!ignored.has(lineOf(m.index))) project.hexes.push([m[0], shown, lineOf(m.index)]);
  const sm = src.match(/Instrument[ +]Serif|Fraunces|Playfair|Cormorant|Newsreader/i); if (sm && !project.serif) project.serif = sm[0];
  for (const m of src.matchAll(/\brounded-(2xl|3xl)\b|border-radius\s*:\s*([\d.]+(px|rem|em))/gi)) { if (ignored.has(lineOf(m.index))) continue; const k = m[1] ? 'rounded-' + m[1] : 'border-radius:' + m[2]; if (/^border-radius:0?(px|rem|em)?$|:0[a-z]*$/.test(k)) continue; project.radius[k] = (project.radius[k] || 0) + 1; project.ruleLine[k] ||= [shown, lineOf(m.index)]; }
  for (const [id, cat, sev, re, msg] of RULES) {
    if (!re) continue;
    if (isScript && COPY.has(id)) continue;
    if (['meta-dot-string', 'arrow-cta', 'icon-tile', 'shadcn-default'].includes(id) && /\.(css|scss)$/.test(ext)) continue;
    if (id === 'raw-hex-in-component' && !/\.(css|scss)$/.test(ext) ) continue;
    if (['hype-copy', 'stock-phrases', 'stock-cta', 'fake-proof', 'emoji-icon', 'testimonial-check'].includes(id) && /\.(css|scss)$/.test(ext)) continue;
    re.lastIndex = 0; let m; let n = 0;
    while ((m = re.exec(src)) && n < 25) {
      n++;
      const ln = lineOf(m.index);
      if (id === 'raw-hex-in-component' && (/^\s*--/.test(lines[ln - 1]) || /#(fff|ffffff|000|000000)\b/i.test(m[0]))) continue;
      if (['important', 'hidden-at-rest'].includes(id) && inReduced(m.index)) continue;
      if (id === 'outline-none' && /:focus-visible/.test(src)) { if (findings.some(x => x.id === id && x.file === shown)) continue; push({ file: shown, line: ln, id, category: cat, severity: 'craft', match: m[0], message: 'Outline removed, but a :focus-visible rule exists in this file. Confirm it covers this element.' }); continue; }
      if (findings.some(x => x.id === id && x.line === ln && x.file === shown)) continue;
      if ((id === 'centered-hero' || id === 'shadcn-default') && findings.some(x => x.id === id && x.file === shown)) continue;
      push({ file: shown, line: ln, id, category: cat, severity: sev, match: m[0].slice(0, 80), message: msg });
    }
  }
  if (/(transition|animation)\s*:|@keyframes|\banimate-|\btransition\b/.test(src) && !/prefers-reduced-motion|motion-safe|motion-reduce|useReducedMotion/.test(src) && /\.(css|scss|html|htm|vue|svelte|astro)$/.test(ext)) {
    push({ file: shown, line: 1, id: 'no-reduced-motion', category: 'motion', severity: 'craft', match: '', message: RULES.find(r => r[0] === 'no-reduced-motion')[4] });
  }
  if (!/\.(css|scss)$/.test(ext) && !isScript) emDash += (src.match(/—|&mdash;/g) || []).length;
}
if (emDash >= 10) findings.push({ file: '(all)', line: 0, id: 'em-dash-cadence', category: 'copy', severity: 'tell', match: String(emDash), message: `${emDash} em dashes across files; check whether they form a repetitive cadence.` });

// ---- project-level tells (across all scanned files) ----
const warmCream = project.bgs.filter(([h]) => { const [hu, sa, l] = hsl(hexRgb(h)); return l >= 0.9 && l < 0.995 && hu >= 20 && hu <= 60 && sa >= 0.15; });
const terracotta = project.hexes.find(([h]) => near(h, '#D97757') || near(h, '#C96442'));
if (warmCream.length && (project.serif || terracotta)) { const [h, file, line] = warmCream[0]; findings.push({ file, line, id: 'tasteful-default', category: 'color', severity: 'tell', match: h + (project.serif ? ' + ' + project.serif : '') + (terracotta ? ' + ' + terracotta[0] : ''), message: 'Cream ground + editorial serif' + (terracotta ? ' + terracotta accent' : '') + ': the current "tasteful" generated house style. Needs a brand reason.' }); }
const blackBg = project.bgs.filter(([h]) => hexRgb(h).every((v) => v <= 0x11));
const acid = project.hexes.find(([h]) => { const [hu, sa, l] = hsl(hexRgb(h)); return sa > 0.7 && l > 0.4 && l < 0.75 && ((hu >= 65 && hu <= 110) || (hu >= 4 && hu <= 18)); });
if (blackBg.length && acid) { const [h, file, line] = blackBg[0]; findings.push({ file, line, id: 'acid-on-black', category: 'color', severity: 'tell', match: h + ' + ' + acid[0], message: 'Near-black ground with acid lime / vermilion accent: the "edgy" generated default.' }); }
for (const [k, c] of Object.entries(project.radius)) if (c >= 8) { const [file, line] = project.ruleLine[k]; findings.push({ file, line, id: 'uniform-radius', category: 'layout', severity: 'tell', match: k + ' x' + c, message: 'Same large radius used everywhere. Vary radius by component role.' }); }
for (const r of roots) { try { const cj = JSON.parse(readFileSync(join(statSync(r).isDirectory() ? r : join(r, '..'), 'components.json'), 'utf8')); const bc = cj?.tailwind?.baseColor; if (/^(slate|zinc|neutral|gray|stone)$/.test(bc || '')) findings.push({ file: 'components.json', line: 1, id: 'shadcn-default', category: 'system', severity: 'low', match: 'baseColor ' + bc, message: 'shadcn/ui base color left at a stock gray; check the CSS variables were customised.' }); } catch {} }

const tellHits = findings.filter((x) => WEIGHT[x.id] && (x.severity !== 'gate' || x.id === 'hidden-at-rest'));
const distinct = [...new Set(tellHits.map((x) => x.id))];
const vibe = +distinct.reduce((acc, k) => acc + WEIGHT[k], 0).toFixed(1);
const strong = distinct.filter((k) => WEIGHT[k] >= 1);
const verdict = strong.length >= 3 ? 'reads AI (cluster)' : strong.length ? 'isolated tells; one alone proves nothing' : 'no meaningful tell cluster';

if (asJson) { console.log(JSON.stringify({ files: files.length, waived, vibe: { score: vibe, distinctTells: distinct, strongTells: strong, verdict }, weights: WEIGHT, findings: findings.map((x) => ({ ...x, weight: WEIGHT[x.id] || 0 })) }, null, 2)); }
else {
  const order = { gate: 0, tell: 1, low: 2, craft: 3 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line);
  console.log(`slopscan: ${files.length} files, ${findings.length} findings (advisory: judge each one)\n`);
  const counts = {};
  for (const x of findings) {
    counts[x.severity] = (counts[x.severity] || 0) + 1;
    console.log(`[${x.severity.toUpperCase()}] ${x.id}${WEIGHT[x.id] ? ' w' + WEIGHT[x.id] : ''}  ${x.file}:${x.line}  ${x.match ? '«' + x.match.replace(/\s+/g, ' ').slice(0, 60) + '»  ' : ''}${x.message}`);
  }
  console.log(`\nSummary: gate=${counts.gate || 0} tell=${counts.tell || 0} low=${counts.low || 0} craft=${counts.craft || 0} waived=${waived}`);
  console.log(`Vibe score: ${vibe} (cluster of ${strong.length} distinct medium/high tells${strong.length ? ': ' + strong.join(', ') : ''}) — reads AI if >= 3 distinct medium/high tells; one tell alone proves nothing. Verdict: ${verdict}`);
}
process.exitCode = findings.length ? 2 : 0;
