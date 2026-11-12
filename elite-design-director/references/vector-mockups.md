# Brand Graphics, Presentation and Mockups
Contents: 1. Vector vs preview · 2. Concept sheets · 3. Presentation board · 4. Mockup set by industry · 5. Brand asset pack · 6. Formats  _(read only the section you need)_

## 1. Vector deliverables vs raster previews
Always label each file as either an **editable vector deliverable** (SVG/PDF/EPS masters) or a **preview** (PNG renders, mockups, boards). Previews never replace masters. Photoreal mockups made with Photoshop or AI tools are raster previews; say so.

## 2. Concept sheets (checkpoint)
One sheet per round, greyscale first: each concept large, plus the lockup, true 64/32/16 px renders, its name and one-line idea, and the recommendation. Build as HTML (CSS grid, inlined SVGs) and screenshot with `shoot.mjs` or `svgcheck` (contact sheet). Keep it plain so the marks are judged, not the layout.

## 3. Presentation board (original layouts, HTML)
Slides: brief → each concept (rationale + 4–6 mockups) → side-by-side comparison → recommendation and next step. Use the brand's own palette and type; mockups are **CSS/SVG-drawn** (cards, screens, signage) so they stay crisp and editable, and you can export PNGs per slide with `shoot.mjs`. Don't use third-party mockup PSDs or photos without a license.

## 4. Mockup set by industry (pick 4–6)
| Industry | Mockups |
|---|---|
| Software / SaaS | App icon on home screen, browser tab favicon, website header, dashboard login, README/docs header, sticker |
| Automotive / service | Vehicle door or wrap panel, shop signage, uniform/embroidery patch, invoice header, app icon, social avatar |
| E-commerce / retail | Shopping bag, product tag, packaging box, website header, social avatar |
| Food / hospitality | Cup, menu, storefront sign, bag, apron |
| Corporate / professional | Business card, letterhead, email signature, signage, slide master |
| Luxury | Foil business card, embossed packaging, garment label, monogram pattern |
Test reversed and one-colour versions inside the mockups (embroidery and engraving usually need one colour; check minimum stroke for the medium).

## 5. Brand asset pack (kit structure)
```
brand/
  logo/  {name}-primary.svg  -horizontal.svg  -stacked.svg  -symbol.svg  -wordmark.svg
         -black.svg  -white.svg  -mono.svg  -reversed.svg  (+ PNG 512/1024)
  favicon/ favicon.ico favicon-16/32/48.png apple-touch-icon.png icon-192.png icon-512.png maskable-512.png site.webmanifest head-snippet.html
  icons/ {set}.svg (+ sprite.svg)
  illustrations/ {name}-light.svg {name}-dark.svg
  guidelines.md (clear space, minimum sizes, colours HEX/RGB/CMYK/Pantone, type, do/don't)
  MANIFEST.md (provenance)
```
Generate variants and favicons with `node scripts/svgexport.mjs` (see `vector-engine.md` §8).

## 6. Formats
- **SVG:** web and master. Optimise; keep viewBox and title.
- **PDF (vector):** print handoff, export from the browser or a vector tool; embed fonts or outline text.
- **EPS/AI:** only if a printer asks; produce from a vector editor if available, otherwise deliver PDF and SVG and say so.
- **PNG:** sized in px for the target (no "72 dpi" myth); transparent background; 1× and 2×.
- **CMYK/Pantone:** specify values in the guidelines; actual colour conversion happens in print software, so say so.
