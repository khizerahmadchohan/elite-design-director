# SVG-First Illustration
Contents: 1. Brief · 2. Style systems · 3. Composition · 4. Building in SVG · 5. Archetypes · 6. Light/dark & theming · 7. Animation · 8. Refinement  _(read only the section you need)_

Hand-authored, editable SVG for hero, feature, section, editorial, product, business and technical illustrations, mascots, isometric scenes and geometric compositions. These are real paths, shapes, groups, gradients and masks, never an embedded bitmap.

## 1. Brief (fill from the project; don't invent)
- Placement and **real render size**: slot ratio and px at 390 and 1440. The smallest size binds detail.
- Job: explain a mechanism? Set a mood? Show the product? Illustrations that only decorate are the first to cut.
- Palette: the site's tokens (exact hex) and the color strategy (`typography-and-color.md` Part B).
- Style reference: the site's existing illustration and icon language, or a **named** style ("2px monoline technical", "flat geometric with one shadow tone"). "Modern/clean" is not a style.
- Variants needed: light/dark, mobile crop, animated or static.

## 2. Style systems (choose one per site, write its rules down)
| Style | Rules to fix | Fits |
|---|---|---|
| Monoline / line art | One stroke weight (match UI icons: e.g. 1.5–2 units at 24 → scale proportionally), round caps/joins, one accent fill | SaaS, technical, docs |
| Flat geometric | Primitives only, 2–4 colours + 1 shadow tone, no outlines | Brand graphics, marketing |
| Duotone / tonal | Brand colour ramp (3–5 steps from `palette.mjs`), depth by value | Bold brands, heroes |
| Isometric | 30° axes (2:1 pixel ratio approximations are ok), consistent light from one side (top 100%, left 85%, right 70% values) | Process/system diagrams, logistics, automotive service flows |
| Technical / diagrammatic | Real labels in HTML (not in SVG text) for accessibility, thin rules, callouts | Dashboards, B2B, engineering |
| Editorial cut-paper / shapes | Organic but intentional shapes, limited palette, textures only as vector patterns | Editorial, culture |
Avoid unmotivated defaults: blob-people, unDraw-style figures, floating gradient orbs, random confetti and generic isometric laptops (`anti-ai-design.md`).

## 3. Composition
- **One focal point**, a clear reading path and value contrast concentrated at the focus.
- Respect the slot: leave calm space where text overlaps; design a separate mobile crop or a simplified mobile version if the desktop composition collapses at 390.
- Scale detail to render size: nothing thinner than about 1 px at the smallest display size (for an 800 px wide asset shown at 390 px, the minimum stroke ≈ 2 units).
- Count shapes: if it needs 500+ nodes to read, simplify the idea.

## 4. Building in SVG
- Plan the layers first: `bg` → `scene` (back to front) → `fg` → `accents`. Use named groups, and `transform` on groups rather than editing every point.
- Use primitives where possible (rect/circle/ellipse/line/polygon) for clean editability; paths for organic forms.
- **Reuse:** `<symbol>` + `<use>` for repeated elements (wheels, windows, people); `<pattern>` for textures; `<linearGradient>`/`<radialGradient>` with `userSpaceOnUse` for predictable shading.
- **Masks/clipPaths:** allowed in illustrations. Keep them few and named, and check that they render in Chrome *and* as an `<img>` (`svgcheck` does both).
- No `<text>` for meaningful copy: put copy in HTML next to the SVG (translatable, accessible, SEO).
- Prefix every id with the asset name. Round coordinates to 1–2 decimals. Run `svgcheck --optimize`.

## 5. Archetypes (pick per section, see `design-generation.md` §7–8)
- **Mechanism diagram:** how the product works, ad → funnel → lead → purchased unit. Strongest for B2B.
- **Product-in-context:** simplified UI plus the real-world object (car, phone, plate) composed together.
- **Spec drawing / blueprint:** dimension lines, callouts, measured geometry. Good for automotive and engineering.
- **Map / route:** location, coverage, service area.
- **Object still life:** the brand's real objects drawn with restraint.
- **Mascot:** a character sheet with full body, head-only (small) and 3 expressions; geometry consistent with the logo.
- **Pattern / texture:** a brand motif tiled as `<pattern>`, for backgrounds without noise.

## 6. Light/dark and theming
- Drive colours with CSS custom properties inside the SVG: `<style>:root{--ink:#0F172A;--paper:#fff;--accent:#004EEB}@media (prefers-color-scheme:dark){:root{--ink:#E2E8F0;--paper:#0B1220;--accent:#4E7AE8}}</style>` and `fill="var(--ink)"`. This works inline and as `<img>` standalone. **Caveat:** some sanitizers strip `<style>`; for WordPress delivery, bake two files with `node scripts/svgexport.mjs art.svg --out dist --themes` (`-light.svg`, `-dark.svg`).
- Or use `currentColor` for single-colour line art, so it inherits the text colour.
- Dark variants are **designed**, not inverted: lower chroma on large fields, lighter accents, thinner light-on-dark strokes (2–5%), and check contrast of key shapes against the new ground.
- Export and review both on the contact sheet (it renders light and dark rows).

## 7. Animation (only with a job; see `motion-and-interactions.md`)
- Prefer CSS on inline SVG: `transform` on groups (`transform-box: fill-box; transform-origin: center`), `stroke-dasharray`/`stroke-dashoffset` for line draws, opacity.
- One authored moment, not perpetual loops; pause offscreen; honour `prefers-reduced-motion` with a static final frame.
- SMIL works without JS but is harder to control and can't be paused by reduced motion. Avoid it for UI.
- Lottie or JS libraries only if the project already uses them.

## 8. Refinement
Render (`svgcheck`) → name the worst failure (focal point weak, silhouette muddy at mobile size, palette off-token, a cluttered region) → fix → re-render, 2–3 passes. Then **check in context** (`shoot.mjs --around`) next to the real headline, buttons and icons: same line weight family, same corner language, palette roles respected.
