# Vector Quality Audit
Run `node scripts/svgcheck.mjs <files> [--set] --out <dir>` first and **read the contact sheet**. Mark each item pass / fail / n.a. / not checked (why).

## A. SVG technical (svgcheck covers most)
- [ ] Parses as standalone SVG (with `xmlns`); renders as `<img>`.
- [ ] `viewBox` present; ratio matches any width/height; no fixed size on masters.
- [ ] **0 embedded rasters** (or, if a raster is intentional, it's labelled a raster asset).
- [ ] No `<script>`, `on*=`, `<foreignObject>` or external refs (sanitizer-safe).
- [ ] No broken gradient/mask/clip/`use` references; no duplicate or generic colliding ids.
- [ ] No accidental clipping; content centred or intentionally offset.
- [ ] Named groups, prefixed ids, coordinates ≤ 2 decimals, editor junk removed (`--optimize`).
- [ ] File size within budget (icon < 2 KB, logo < 15 KB, illustration ≲ 80 KB).
- [ ] `role="img"` + `<title>` (meaningful) or `aria-hidden` (decorative).

## B. Visual
- [ ] Balanced proportions; clear focal point; consistent geometry and curve quality (no lumps, notches or slivers at joins).
- [ ] Stroke widths appropriate to display size; negative space works; visual weight even.
- [ ] Colours are the brand/site tokens (exact hex); contrast of key shapes against intended backgrounds.
- [ ] Reads at its smallest real size (contact sheet row) and on light **and** dark.

## C. Logo-specific
- [ ] Recognisable at 16/24/32 px (or a favicon companion exists).
- [ ] One-colour black, white and reversed versions work; reversed thinned 2–5%.
- [ ] Horizontal, stacked and symbol/wordmark lockups with fixed proportions.
- [ ] Optical corrections applied (overshoot, thinner horizontals); clean angles; nothing under 1/48 of the mark.
- [ ] No live text; letterforms pass the letter test; font license permits logo use.
- [ ] Distinct from category clichés and existing marks; trademark search recommended.

## D. Icon-specific (`--set`)
- [ ] One viewBox, one stroke width, one cap/join style, one outline/filled mode.
- [ ] No visual-weight outliers; consistent corners and keylines; pixel-aligned strokes.
- [ ] `currentColor`; clear at 16, 24 and 32 px; consistent naming.
- [ ] Not mixed with another family in the same UI.

## E. Integration (never judge in isolation)
- [ ] Viewed at real size in the real page (`shoot.mjs --around`) at 390 and 1440.
- [ ] Matches the site's line weight, radius language, palette roles and illustration style.
- [ ] Section-level and page-level consistency (`consistency-audit.md`).
- [ ] Platform delivery is correct (Elementor widget/field, sanitizer-safe file, responsive width).
- [ ] Provenance row written; vector vs preview labelled.
