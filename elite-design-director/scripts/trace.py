#!/usr/bin/env python3
"""
elite-design-director / trace.py
Raster (PNG/JPG/WebP) -> genuine vector SVG for flat-colour artwork (logos, icons, simple illustrations).
Original implementation. Needs only Pillow. If `vtracer` (MIT, pip) is installed and --engine vtracer
is given, it delegates to it instead.

How it works (pillow engine):
  1. load, flatten transparency, cap size (--max, default 512 px)
  2. quantize to N colours (--colors, default auto 2-8) and drop near-duplicate colours
  3. detect the background colour (corner pixels) and skip it (unless --keep-bg)
  4. per colour layer: trace pixel-boundary contours (outer + holes), remove specks (--min-area)
  5. simplify with Ramer-Douglas-Peucker (--tolerance px), then smooth gentle corners into
     quadratic curves while keeping sharp corners sharp (--corner deg)
  6. write one <path fill-rule="evenodd"> per colour, grouped, viewBox = source size
The output contains NO embedded raster. Photographs / gradients / soft shadows do not trace well:
the script reports a "trace-suitability" estimate and warns.

Usage: python trace.py input.png output.svg [--colors 4] [--max 512] [--tolerance 1.0]
                       [--min-area 12] [--corner 50] [--keep-bg] [--engine pillow|vtracer]
"""
import sys, math, argparse, os
from collections import Counter, defaultdict
from PIL import Image

def pixels(img):
    f = getattr(img, 'get_flattened_data', None)
    return list(f()) if f else list(img.getdata())

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--colors', type=int, default=0)
ap.add_argument('--max', type=int, default=512)
ap.add_argument('--tolerance', type=float, default=1.0)
ap.add_argument('--min-area', type=int, default=12)
ap.add_argument('--corner', type=float, default=50.0, help='turn angle (deg) above which a vertex stays a sharp corner')
ap.add_argument('--keep-bg', action='store_true')
ap.add_argument('--engine', default='pillow')
a = ap.parse_args()

if a.engine == 'vtracer':
    try:
        import vtracer  # optional, MIT
    except ImportError:
        sys.exit('vtracer not installed (pip install vtracer). Use --engine pillow.')
    vtracer.convert_image_to_svg_py(a.src, a.dst, colormode='color', hierarchical='stacked', mode='spline',
                                    filter_speckle=4, color_precision=6, corner_threshold=60, path_precision=2)
    print('traced with vtracer ->', a.dst); sys.exit(0)

im = Image.open(a.src).convert('RGBA')
W0, H0 = im.size
scale = min(1.0, a.max / max(W0, H0))
if scale < 1: im = im.resize((max(1, round(W0 * scale)), max(1, round(H0 * scale))), Image.LANCZOS)
W, H = im.size
bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
transparent = sum(1 for p in pixels(im) if p[3] < 128) / (W * H)
flat = Image.alpha_composite(bg, im).convert('RGB')

# suitability: how many distinct colours does the image really use?
small = flat.resize((min(128, W), min(128, H)), Image.NEAREST)
distinct = len(set(pixels(small)))
qc = a.colors
if not qc:
    # auto: colours that cover >= 1.5% after a 16-colour quantize
    q16 = flat.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
    cnt = Counter(pixels(q16)); tot = W * H
    qc = max(2, min(8, sum(1 for v in cnt.values() if v / tot >= 0.015)))
q = flat.quantize(colors=qc, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
pal = q.getpalette()[:qc * 3]
colors = [tuple(pal[i * 3:i * 3 + 3]) for i in range(qc)]
px = pixels(q)

# background: most common index among the border pixels (or transparent area)
border = [px[x] for x in range(W)] + [px[(H - 1) * W + x] for x in range(W)] + [px[y * W] for y in range(H)] + [px[y * W + W - 1] for y in range(H)]
bg_idx = Counter(border).most_common(1)[0][0]
if transparent > 0.02:
    alpha = pixels(im.getchannel('A'))

def contours(mask):
    """Trace pixel-boundary loops of a binary mask (list of bools, W*H). Returns list of point loops."""
    # directed boundary edges with the filled pixel on the left, keyed by start vertex
    nxt = defaultdict(list)
    for y in range(H):
        row = y * W
        for x in range(W):
            if not mask[row + x]: continue
            if y == 0 or not mask[row - W + x]: nxt[(x, y)].append((x + 1, y))          # top edge  ->
            if x == W - 1 or not mask[row + x + 1]: nxt[(x + 1, y)].append((x + 1, y + 1))  # right edge v
            if y == H - 1 or not mask[row + W + x]: nxt[(x + 1, y + 1)].append((x, y + 1))  # bottom <-
            if x == 0 or not mask[row + x - 1]: nxt[(x, y + 1)].append((x, y))          # left ^
    loops = []
    while nxt:
        start = next(iter(nxt)); loop = [start]; cur = start; prev_dir = None
        while True:
            outs = nxt[cur]
            if len(outs) > 1 and prev_dir is not None:
                # at a pinch vertex prefer turning right (keeps loops simple)
                outs.sort(key=lambda p: ((math.atan2(p[1] - cur[1], p[0] - cur[0]) - prev_dir) % (2 * math.pi)))
            n = outs.pop(0)
            if not outs: del nxt[cur]
            prev_dir = math.atan2(n[1] - cur[1], n[0] - cur[0])
            if n == start: break
            loop.append(n); cur = n
            if cur not in nxt: break
        if len(loop) >= 4: loops.append(loop)
    return loops

def collinear_reduce(pts):
    out = []
    n = len(pts)
    for i in range(n):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % n]
        if (p1[0] - p0[0]) * (p2[1] - p1[1]) - (p1[1] - p0[1]) * (p2[0] - p1[0]) != 0: out.append(p1)
    return out

def rdp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy) or 1e-9
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L
        if d > dmax: dmax, idx = d, i
    if dmax > eps: return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]

def simplify_loop(loop, eps):
    pts = collinear_reduce(loop)
    if len(pts) < 3: return pts
    # split the closed loop at its two farthest-apart points for a stable RDP
    i0 = 0; i1 = max(range(len(pts)), key=lambda i: (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2)
    a1 = rdp(pts[i0:i1 + 1], eps); a2 = rdp(pts[i1:] + pts[:1], eps)
    return a1[:-1] + a2[:-1]

def area(pts):
    return 0.5 * sum(pts[i - 1][0] * pts[i][1] - pts[i][0] * pts[i - 1][1] for i in range(len(pts)))

def fmt(v): return ('%.2f' % v).rstrip('0').rstrip('.')

def smooth_path(pts, sx, sy, corner_deg):
    """Sharp vertices stay sharp; gentle vertices become quadratic curves through edge midpoints."""
    n = len(pts)
    P = [(p[0] * sx, p[1] * sy) for p in pts]
    def turn(i):
        a, b, c = P[i - 1], P[i], P[(i + 1) % n]
        a1 = math.atan2(b[1] - a[1], b[0] - a[0]); a2 = math.atan2(c[1] - b[1], c[0] - b[0])
        d = abs((a2 - a1 + math.pi) % (2 * math.pi) - math.pi); return math.degrees(d)
    sharp = [turn(i) >= corner_deg for i in range(n)]
    mid = lambda i: ((P[i][0] + P[(i + 1) % n][0]) / 2, (P[i][1] + P[(i + 1) % n][1]) / 2)
    # start at a sharp vertex if any, else at the first midpoint
    s = next((i for i in range(n) if sharp[i]), None)
    d = []
    if s is None:
        m = mid(n - 1); d.append(f'M{fmt(m[0])} {fmt(m[1])}')
        for i in range(n):
            m2 = mid(i); d.append(f'Q{fmt(P[i][0])} {fmt(P[i][1])} {fmt(m2[0])} {fmt(m2[1])}')
    else:
        d.append(f'M{fmt(P[s][0])} {fmt(P[s][1])}')
        for k in range(1, n + 1):
            i = (s + k) % n
            if sharp[i]:
                if not sharp[(i - 1) % n]: pass
                d.append(f'L{fmt(P[i][0])} {fmt(P[i][1])}')
            else:
                m2 = mid(i); d.append(f'Q{fmt(P[i][0])} {fmt(P[i][1])} {fmt(m2[0])} {fmt(m2[1])}')
                if sharp[(i + 1) % n]: pass
    d.append('Z'); return ''.join(d)

sx, sy = W0 / W, H0 / H
layers = []
order = sorted(range(qc), key=lambda i: -px.count(i))  # big areas first (painted underneath)
for ci in order:
    if ci == bg_idx and not a.keep_bg: continue
    mask = [(p == ci) for p in px]
    if transparent > 0.02: mask = [m and alpha[k] >= 128 for k, m in enumerate(mask)]
    if sum(mask) < a.min_area: continue
    paths = []
    for loop in contours(mask):
        if abs(area(loop)) < a.min_area: continue
        sp = simplify_loop(loop, a.tolerance)
        if len(sp) < 3 or abs(area(sp)) < a.min_area * 0.6: continue
        paths.append(smooth_path(sp, sx, sy, a.corner))
    if paths:
        r, g, b = colors[ci]; layers.append((f'#{r:02x}{g:02x}{b:02x}', paths))

base = os.path.splitext(os.path.basename(a.dst))[0].replace(' ', '-')
out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W0} {H0}" role="img"><title>{base}</title>']
if a.keep_bg:
    r, g, b = colors[bg_idx]; out.append(f'<rect width="{W0}" height="{H0}" fill="#{r:02x}{g:02x}{b:02x}"/>')
for i, (col, paths) in enumerate(layers):
    out.append(f'<path id="{base}-c{i + 1}" fill="{col}" fill-rule="evenodd" d="{"".join(paths)}"/>')
out.append('</svg>')
svg = ''.join(out)
open(a.dst, 'w', encoding='utf8').write(svg)

npaths = sum(len(p) for _, p in layers)
suit = 'good' if distinct < 400 else 'fair' if distinct < 3000 else 'poor (photo-like: expect posterized result)'
print(f'traced -> {a.dst}')
print(f'  source {W0}x{H0} (traced at {W}x{H}) | colours used {len(layers)}/{qc} (bg {"kept" if a.keep_bg else "removed"}) | subpaths {npaths} | {len(svg)/1024:.1f} KB | raster embedded: no')
print(f'  trace-suitability: {suit} (distinct colours in a 128px sample: {distinct})')
if distinct >= 3000: print('  WARNING: gradients/photographic detail cannot be reproduced faithfully as flat vector shapes. Redraw by hand for a clean logo.')
