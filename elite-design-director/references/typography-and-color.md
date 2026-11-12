# Typography and Color

## Part A: Typography

### A1. Choosing faces
Shortlists by voice, with sources, licenses and saturation risk: `type-library.md`. Check the cross-project history (`design-generation.md` §6) so consecutive projects don't reuse the same display face.

- Choose type the way a set designer chooses props: **as an object from the subject's world.** Ask: what letterforms appear in this trade's real environment? Engineering drawings, shop signage, book printing, transit wayfinding, fashion labels, instrument dials? Then find a well-made face with that character.
- A subject association alone is not a reason. "Books → serif" and "tech → mono" are clichés. The reason must be specific: "Bay signage uses condensed grotesques with tight spacing, so the display face is a condensed grotesque."
- **Faces overused by generated UI** (need a stated reason on Persuade/Experience surfaces): Inter or Roboto as display, Poppins, Montserrat, Open Sans, Lato, Raleway, Nunito, Work Sans, DM Sans, Plus Jakarta Sans, Outfit, Syne, Space Grotesk, Space Mono, Instrument Sans/Serif, Geist as display; Playfair Display, Fraunces, Cormorant, DM Serif, Lora, Newsreader as reflexive "elegant" picks.
- **Operate/Read surfaces:** a familiar, highly legible workhorse sans is correct (Inter, IBM Plex Sans, Source Sans 3, system UI stack, Geist). Brand expression goes into one display use (page titles, marketing shell) and the details.
- **Pairing logic:** contrast on *one* axis (structure: serif vs sans; or width; or weight), harmony on the others (x-height, proportion, era). Two families is the norm, plus an optional mono for data or code. Add a second family only if it plays a role the first cannot.
- **Sources:** Google Fonts and Fontshare (free, self-hostable), or the brand's licensed fonts. Check the license for web embedding. Self-host for performance and privacy where possible.
- Existing brand fonts: keep them. If one is weak, adjust *usage* (size, weight, tracking, measure) before proposing a replacement.

### A2. Scale and metrics
| Property | Marketing / Persuade | App / Operate | Long-form / Read |
|---|---|---|---|
| Body size | 16–20px | 14–16px (14 only for dense secondary UI) | 17–21px |
| Scale ratio | 1.25–1.5 (hand-tune display) | 1.125–1.2, fixed rem steps | 1.2–1.333 |
| Largest display | ~3.5–6× body (≤ 6rem typical; larger only with intent) | page title ~1.5–2× body | ~2.5–3.5× body |
| Line height | display 0.95–1.15, body 1.5–1.7 | 1.35–1.5 | 1.55–1.75 |
| Measure | 45–75ch (mobile 35–60) | tables may run wider | 60–72ch ideal |

- Use fluid `clamp()` for marketing display sizes. Use fixed rem steps in app UI.
- **Tracking:** display −0.01 to −0.04em (more negative as size grows; never past −0.05em). Body 0. Small caps and uppercase labels +0.02 to +0.08em. No negative tracking below ~16px.
- **Weights:** pick 2–3, far enough apart to read as different (400 + 600/700, or 300 + 700). Low-weight large display (300–500) is a valid premium voice, but it is a style choice, not a rule. In app UI, 400/500/600 is usually enough.
- **Light text on dark:** add a little line height, a little tracking (+0.01em), and consider one weight step up.
- Hierarchy comes from size, weight, color *and* space. Space above a heading should be greater than space below it (around 1.5–2× more).
- `text-wrap: balance` on headings and short centered text. `text-wrap: pretty` on paragraphs. Check that line breaks don't strand single words at every width.
- Use tabular numerals (`font-variant-numeric: tabular-nums`) in tables, prices, stats and timers. Use real quotes, apostrophes and ellipses (… not ...). Non-breaking spaces go between numbers and units ("10 km").
- Sentence case for headings, buttons and labels by default. Title Case only if the brand uses it consistently.
- Avoid: justified text without hyphenation, long all-caps passages, body text under 14px, interactive text under 12px, and paragraph spacing combined with first-line indents.

### A3. Delivery
- Load only the weights you use. Use `font-display: swap` (or `optional` for non-critical faces), preload the 1–2 critical files, subset if possible, and provide metric-compatible fallbacks (`size-adjust`) to reduce layout shift.
- In Elementor: set Global Fonts, use the theme's font settings or custom fonts upload, and avoid loading the same family twice (theme plus Elementor). See `wordpress-elementor.md`.

## Part B: Color

### B1. Strategy before swatches
Pick one strategy per surface, then choose hues:
| Strategy | Description | Good for |
|---|---|---|
| **Restrained** | Tinted neutrals + one accent (accent ≈ ≤5–10% of the view) | Product UI, professional services, most Operate surfaces |
| **Committed** | One saturated brand color owns 30–60% of the surface (whole sections) | Confident brands, local services that need recall |
| **Full palette** | 3–4 named roles used deliberately (e.g., per category or section) | Editorial, kids, culture, multi-product |
| **Drenched** | The surface *is* the color; type and imagery sit on it | Campaigns, launches, posters, portfolio |

Color commits at **region scale**. A drenched band of brand color is stronger than accent sprinkles on twenty elements.

### B2. Choosing hues
- Derive the anchor hue from the brand's **world**: materials, place, product, history, existing logo. Never from category stereotype (finance → blue, eco → green, AI → purple). If the existing brand *is* blue, keep it and make it specific (a particular blue, tuned).
- Work in **OKLCH** for new palettes: perceptually even steps, predictable contrast. Reduce chroma near the extremes of lightness.
- Build each ramp in ~8–10 steps (L ≈ 97 → 15). Neutrals get a slight chroma (0.005–0.02) toward the anchor hue, never pure gray.
- Light grounds: L 95–99, very low chroma. Dark grounds: L 12–22, not pure #000 (except OLED-specific products). Ink: L 15–25 on light grounds; L 90–96 on dark.

### B3. Roles (semantic tokens)
Minimum role set: `canvas`, `surface` (1–3 steps), `ink` / `ink-secondary` / `ink-muted`, `border` / `hairline`, `primary` + `on-primary` + `primary-hover` / `primary-active`, `focus-ring`, `selection`, `success` / `warning` / `danger` / `info` (each with an `on-` pair), and `chart-1…n` when data viz exists.

Rules:
- Every fill has a paired foreground color, checked for contrast.
- The primary-action color is not spent on decoration. Decorative accents stay off buttons.
- Secondary text on a colored surface is a darker or lighter shade of *that* surface's hue, never generic gray.
- Never use color as the only signal: pair status with an icon, text or shape.
- Hover, active and focus states have *more* contrast than rest.
- Prefer explicit colors over stacked translucency (alpha on alpha breaks contrast predictability).

### B4. Contrast (verify, don't eyeball)
- WCAG 2.2 AA is the requirement: body text ≥4.5:1; large text (≥24px, or ≥18.66px bold) ≥3:1; UI components, icons, focus indicators and meaningful graphics ≥3:1 against adjacent colors.
- APCA (Lc ~60 body, ~45 large) is a useful design aid for dark mode and thin type, but still verify WCAG 2.
- Check placeholder text, disabled-but-informative text, text on photos (measured at the worst crop), and focus rings against both the component and the page.
- Simulate color-vision deficiency for charts and status systems.

### B5. Dark mode
Design it; don't invert it. Remap semantic roles, lower chroma of large fields, build depth from surface lightness steps (higher = lighter) rather than shadows, re-check every contrast pair, and set `color-scheme` and `<meta name="theme-color">`. Offer dark mode only if the product's use-scene benefits or the brand requires it. Not every marketing site needs one.

### B5b. Generate, don't eyeball
Run `node ${CLAUDE_SKILL_DIR}/scripts/palette.mjs <anchorHex> --strategy <restrained|committed|full|drenched> [--css] [--elementor]`. It prints an OKLCH ramp, tinted neutrals, the semantic role map and a WCAG pass/fail table for every pair. Worked flow: **world** (fleet depot, safety signage) → **anchor** (#E8590C from hi-vis vests) → **ramp** (palette.mjs) → **roles** (orange as a fill with dark ink text; never orange text on white, since it fails at 3.58:1) → **verify** in the browser with `shoot --a11y`.

**Dark-mode remap example** (semantic layer only):
| Role | Light | Dark |
|---|---|---|
| canvas | neutral-50 (L≈0.98) | neutral-950 (L≈0.16) |
| surface-1/2 | neutral-100/200 | neutral-900/850 (higher = lighter) |
| ink / ink-secondary | neutral-900 / 600 | neutral-50 / 300 |
| primary (fill) | anchor-600 | anchor-400/500 (lower chroma) |
| on-primary | white or ink, per contrast | re-check; often ink-950 |
| border | neutral-200 | neutral-800 |
Re-run the contrast table for the dark set; never invert.

### B6. Quick contrast math
Relative luminance L = 0.2126R + 0.7152G + 0.0722B on linearized sRGB channels. Ratio = (L1 + 0.05) / (L2 + 0.05). When in doubt, compute it with a short script rather than guessing.
