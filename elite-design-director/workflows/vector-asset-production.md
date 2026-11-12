# Workflow: Vector Asset Production (illustrations · icon systems · tracing · brand packs)
Start with `references/vector-engine.md` §1 (route) and §2 (low-credit ladder). Then follow one branch.

## 0. Context (any asset for an existing site)
Extract or reuse the Site Language Sheet (`site-consistency.md` §1): palette tokens, type, radius, the existing **icon family and stroke**, existing illustration style, and the asset's slot and real size at 390/1440. The asset inherits this language.

## A. Custom SVG illustration
1. Brief and style system (`svg-illustration.md` §1–2); pick an archetype (§5). Plan the layers.
2. Author SVG (§4), with light/dark via CSS variables or two files (§6).
3. `svgcheck.mjs art.svg --sizes 64,256,800 --out sheet` → read the sheet → fix the worst failure (2–3 passes).
4. **In context:** place it in the page or a copy of it and run `shoot.mjs page.html --widths 390x844,1440x900 --around "<slot selector>"`; check line weight, palette roles, focal clarity and the mobile crop next to the real copy.
5. Optional motion (§7) with reduced-motion fallback. Audit with `checklists/vector-quality-audit.md`. Write a manifest row.

## B. Icon system
1. **Discover** (`icon-systems.md` §1): project family → one permissive library → originals only for gaps.
2. Write the spec (§3): grid, stroke, caps/joins, corners, naming, size, and match to the UI text weight.
3. Draw or collect the set; originals reuse shared sub-shapes (§4).
4. `svgcheck.mjs icons/ --set --sizes 16,24,32,48 --out sheet` → fix mixed strokes/viewBoxes/weight outliers → re-run until "consistent".
5. Deliver as a component set, sprite or Elementor Custom Icons (§6, `wordpress-elementor.md` §10). Check them in the real UI next to labels and buttons.

## C. Image → vector
1. Decide trace / redraw / keep raster (`raster-to-vector.md` §1) and tell the user which and why.
2. Prepare (§2), trace with `trace.py` (§3), clean up with the box method (§4), rebuild text.
3. Verify (§5): `svgcheck` raster 0 and a side-by-side with the source. Report what was traced versus redrawn.

## D. Brand asset pack / presentation
1. Masters approved (logo workflow) → `svgexport.mjs` variants, PNGs and web icons.
2. Icons and illustrations in the brand style (branches A/B).
3. Board and mockups (`vector-mockups.md` §3–4), labelled vector vs preview.
4. Guidelines, MANIFEST and the folder structure (§5).

## Finish (all branches)
`checklists/vector-quality-audit.md` → contact sheet + in-context screenshots in the handoff → history log line.
