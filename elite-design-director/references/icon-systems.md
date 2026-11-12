# Icon Systems
Contents: 1. Discovery first · 2. Library guide · 3. System spec · 4. Drawing original icons · 5. Variants & animation · 6. Delivery · 7. Audit  _(read only the section you need)_

Never mix unrelated icon families in one interface. One family, one grid, one stroke, one corner language.

## 1. Discovery first (cheapest adequate source)
1. **Existing project icons:** inspect the site (theme, Elementor Icon Library / Font Awesome, React imports). If a family exists, the new icons must match it.
2. **One permissive library** that fits the site's line weight and corner style (§2). Search its metadata (names and tags), e.g. Lucide `lucide.dev/icons`, Phosphor, Tabler, Heroicons, or the Kubai `icons.json` index.
3. **Original icon** (§4), drawn to the same spec, when nothing fits or a brand-specific concept is needed (e.g. a licence plate, a VIN plate, a tow hook).
Record the library and license in the manifest. Do not copy whole libraries into projects or this skill; install packages or copy only the icons used.

## 2. Library guide (verify current licenses before use)
| Library | License | Grid / style | Notes |
|---|---|---|---|
| Lucide | ISC | 24, 2px stroke, round caps/joins | Huge set, `stroke-width` adjustable; very common (pick deliberately) |
| Phosphor | MIT | 256 grid, 6 weights incl. duotone & fill | Strong for brand systems needing weights |
| Tabler | MIT | 24, 2px stroke | Large, consistent outline set; filled subset |
| Heroicons | MIT | 24 outline (1.5) / 20 & 16 solid | Tailwind-ecosystem default |
| Material Symbols | Apache-2.0 | Variable fill/weight/grade/size | Android/Material contexts |
| Kubai Icons (`kubai-icons`, `-react`, `-vue`, `-static`) | **MIT for icons and packages** | ~900 base icons (2,800+ with badges), coloured/layered, viewBox `0 -3 31 31`, hover animation via JS | Distinct coloured style; props `size`, `color`, `variant` (color/soft), `trigger`. Index: `icons.json` (name, category, tags) on the `kubai-icons-static` package via jsDelivr. Static SVGs have baked colours, so they are less themeable in WordPress. Its drawing method files (PROMPT/SKILL) are not licensed for adaptation and are not used here |
| Font Awesome Free (Elementor default) | CC BY 4.0 icons / OFL fonts | Mixed | Native in Elementor; inline SVG mode preferred |

## 3. System spec (write it before drawing; it is the contract)
- **Grid/viewBox:** 24×24 (or 20/16 for dense UI). **Live area** 20×20 with 2 px padding. Keylines: circle Ø20, square 18×18, portrait 16×20, landscape 20×16, so circles, squares and tall/wide shapes look equal in weight.
- **Stroke:** one width (1.5 or 2 at 24), `stroke-linecap` and `stroke-linejoin` both round *or* both square, `fill="none"`, `stroke="currentColor"`. Use `vector-effect="non-scaling-stroke"` only if icons are displayed at very different sizes and the line must stay constant.
- **Corners:** one inner radius rule (e.g. 2 px on rectangles); exterior corners of strokes follow the join.
- **Detail density:** at most 2–3 levels of detail; gaps ≥ 2 px at 24 (they close at 16 otherwise).
- **Pixel alignment:** horizontal and vertical strokes centred on .5 for odd widths (e.g. y=11.5 for a 1px stroke), or on integers for 2px strokes, so 1× renders stay crisp.
- **Metaphors:** one metaphor per concept across the set (one "settings" gear everywhere).
- **Naming:** `kebab-case`, noun-first (`car-front`, `plate-search`, `calendar-check`); file = name; variants `-filled`, `-duotone`.
- **Match the UI:** icon stroke ≈ the text weight it sits beside (2px at 24 ≈ 600-weight text at 16px). Corner radius echoes the button/card radius language.

## 4. Drawing original icons
- Start from the keyline shape for its proportion; draw with primitives; keep 2–3 meaningful parts max.
- Reuse sub-shapes across the set (same wheel, same document corner, same arrowhead) via shared geometry.
- Check balance in a row with 4–6 neighbours at 24 and 16; adjust optical size (circles slightly bigger than squares).
- One idea per icon; add a small modifier badge (plus, check, x) in a consistent corner only when the base icon exists.

## 5. Variants and animation
- **Outline** (default UI), **filled** (active/selected states), **duotone** (secondary layer at 20–30% opacity of `currentColor`, or a token colour).
- **Animated icons:** animate only on a state change or interaction (hover, toggle, success), 150–300 ms, transform/opacity/dashoffset on inline SVG. Never loop in persistent UI. Reduced motion means a static end state. For Kubai, use its `trigger` prop (`hover`/`parent`/`none`).

## 6. Delivery
- **React/Vue:** prefer the library's components (tree-shaken imports). For original sets, generate components that take `size`, `strokeWidth`, `className` and `title`, and spread the remaining props.
- **Plain HTML:** inline `<svg>` with `currentColor` for colour inheritance, or an SVG sprite (`<symbol id>` + `<use href="#id">`), which avoids duplicating markup.
- **WordPress/Elementor:** see `wordpress-elementor.md` §10 (upload via Icon Library / Custom Icons, sanitized SVG).
- **Accessibility:** decorative icons get `aria-hidden="true" focusable="false"`; icon-only buttons put the label on the button (`aria-label`), not on the SVG.

## 7. Audit
`node scripts/svgcheck.mjs icons/ --set --sizes 16,24,32,48` flags mixed viewBoxes, mixed stroke widths, caps and joins, mixed outline/filled styles, visual-weight outliers (ink coverage at 24), hard-coded colours and anti-aliasing mush at 16. Then look at the contact sheet and at the icons inside the real UI (`shoot.mjs --around`).
