# Raster → Vector
Contents: 1. Decide: trace, redraw or keep raster · 2. Prepare · 3. Trace · 4. Clean up · 5. Verify · 6. Tool notes  _(read only the section you need)_

## 1. Decide first (be honest)
| Source | Best path |
|---|---|
| Flat logo/icon/badge with few solid colours, ≥ 300 px | **Trace** (`trace.py`), then clean up |
| Small, blurry or JPEG-damaged logo | Upscale cleanly (see §2), trace for reference, then **redraw** key geometry by hand for a crisp master |
| Logo with text | Trace the symbol; **rebuild the text** from the identified (licensed) typeface or by construction. Traced text looks wobbly |
| Gradients, soft shadows, photographic detail | Not faithfully vectorisable. Offer a stylised flat redraw or keep it raster, and say so |
| Line art / sketches | Trace in 2 colours (ink + paper), then simplify |
Never wrap the original bitmap in `<svg><image>` and call it vector. `svgcheck` fails it.

## 2. Prepare the raster
- Crop to the artwork. Remove the background, or keep a uniform background so it can be detected and dropped.
- If it is small (< 300 px), upscale with a method made for flat art (nearest-neighbour ×2 then a mild cleanup, or a flat-art upscaler). Never use a photo model: it adds grain that becomes noise paths.
- If the colour count is known (e.g. a 3-colour logo), pass `--colors N`; otherwise auto-detection picks 2–8.

## 3. Trace
`python scripts/trace.py in.png out.svg [--colors N] [--tolerance 1.0] [--min-area 12] [--corner 50] [--keep-bg]`
- Quantizes colours, drops the background, traces each colour's outer shapes and holes (`fill-rule="evenodd"`), simplifies (RDP tolerance in px), keeps sharp corners above the `--corner` angle and turns gentle vertices into quadratic curves.
- Lower `--tolerance` (0.6) gives more fidelity and more nodes; higher (1.5–2) gives smoother, fewer nodes.
- Raise `--corner` (65–80) for rounder marks and lower it (35–45) for geometric marks with many sharp corners.
- It prints a **trace-suitability** estimate and warns on photo-like input.
- Optional: if the user installs `vtracer` (MIT, `pip install vtracer`), use `--engine vtracer` for spline-quality curves on complex art. Potrace (GPL, separate binary) is also excellent for 1-colour line art if it's present. Don't install either without asking.

## 4. Clean up (the "box method")
Traced output is a starting point, not a master:
- Remove specks; merge same-colour fragments; delete extra anchors so they sit only at extrema and corners with horizontal/vertical handles (draw an imaginary bounding box per curve; anchors go where the curve touches it).
- Snap geometry that was obviously meant to be exact: true circles become `<circle>`/arcs, straight bars become rects, angles become clean 15° steps (`logo-design.md` §5).
- Rebuild any text (§1). Restore exact brand colours (hex from the brand, not the sampled colour).
- Re-run the logo optical checks if it is a logo.

## 5. Verify
`node scripts/svgcheck.mjs out.svg` must show raster 0, a reasonable size and no clipping. Compare the contact sheet side by side with the source at the same size. Report the node/path count and what was redrawn versus traced.

## 6. Tool notes
| Tool | License | Use |
|---|---|---|
| `trace.py` (this skill) | own | Default; Pillow only; flat art |
| vtracer | MIT | Optional upgrade, colour + spline output |
| Potrace | GPL-2.0 | 1-colour line art, superb curves; external binary |
| Inkscape (Trace Bitmap, CLI path ops) | GPL | If installed: boolean union/difference, stroke-to-path |
| Vectorizer.ai, Recraft vectorize | Paid SaaS | Only with consent; upload rights must be OK (client logos are often confidential) |
