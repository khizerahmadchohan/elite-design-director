# Vector Engine: Source Comparison, Deduplication and Licensing (2026-11-12)

Four repositories were shallow-cloned into an isolated research folder and read as untrusted data. No repository scripts were run. Everything in the skill is original wording and original code.

## 1. Sources
| Repo | License (checked) | What it really is | Verdict |
|---|---|---|---|
| kaankiziltug/logo-design-skill | MIT (code + docs). **Its 1,432-logo library is trademarked third-party marks, not MIT** (TRADEMARKS.md) | 7-phase logo workflow, mark-type guide, optical rules, 9 stdlib Python scripts (audit, preview/concept sheets, presentation board, PNG render, export variants + web icons, library search) | Primary logo source. Methods re-expressed; **library excluded** |
| code-katz/claude-illustrate-skill | MIT | Asset-class router, brief table, SVG-first track, contact-sheet render loop, backend notes (Recraft paid, HF, Figma, Canva), provenance manifest, IP notes, 4 sketch SVGs (real vectors) | Process source: routing, inspect loop, provenance |
| designrique/ai-graphic-design-skill | MIT | Portuguese catalogue of mostly paid tools, prompt recipes, raster→vector pipeline (upscale → Vectorizer.ai → box-method cleanup), mockup recipes, IP risk matrix | Only the raster→vector pipeline idea, the box method and the archetype discipline are taken |
| kubai087/kubai-icons | **Icons + npm packages MIT** (LICENSE-ICONS); website/tools/tests/docs all rights reserved; its icon-drawing method (PROMPT/SKILL) source-available, **adaptation not permitted** | ~900 coloured, layered, hover-animated icons (2,800+ with badges), viewBox 0 -3 31 31, React/Vue/web-component/static packages, `icons.json` index | Listed as an option in icon discovery (usage facts only); **no method text adapted, no icons copied** |

## 2. Feature matrix and decisions
| Capability | logo-design | illustrate | ai-graphic | kubai | Best source → decision |
|---|---|---|---|---|---|
| Asset routing | Mode router (design/critique/redesign/system/assets) | Vector / raster / layout router | Tool matrix | — | illustrate + logo modes → `vector-engine.md` §1, extended with icon and trace tracks |
| Brief | 5 questions, 3–5 adjectives | 8 fields, **smallest size binds**, named style | RCAO + StoryBrand + archetype | — | Combined: 5 questions + smallest size + one archetype |
| Concept exploration | 8–12 one-liners → score → 3 most different | 3–5 structurally distinct | 20–40 diffusion images | — | logo-design funnel (cheapest, most distinct); illustrate's "same silhouette = one concept" rule |
| Mark-type taxonomy | Full decision guide | — | — | — | logo-design → `logo-design.md` §3, plus sector notes (new) |
| SVG construction | Grid, clean angles, arcs, 0.5523 handles, squircles, evenodd, no masks in masters | Square viewBox, low nodes, stroke ≥ 2/100 | Box method | — | logo-design rules + box method. Conflict on canvas: 256 for marks, 24 for icons, slot ratio for art |
| Optical corrections | Overshoot 1–3/3–6%, horizontals −5–10%, reversed −2–5%, 1/48 detail floor | — | — | — | logo-design |
| Render & inspect | Preview/concept sheets (Python + external renderer) | Headless-Chrome contact sheet; worst-failure loop; ≤3 passes | "Curate" | — | Merged into **svgcheck.mjs** (own code, Chrome CDP, light+dark, 16–256) + loop rule: ≥2, ≤3 passes |
| SVG audit | svg_audit.py (near-miss angles, live text, rasters, fake knockouts, contrast) | Manual | — | — | New **svgcheck.mjs**: parse, viewBox/ratio, rasters, unsafe content (WP), broken refs, dup ids, clipping, centring, stroke census, small-size anti-alias proxy, `--set` consistency, optimise. Near-miss angle audit stays a manual check (in `logo-design.md` §5) |
| Exports / favicons | export_variants.py --web-icons | Stated, not automated | Format notes | — | New **svgexport.mjs** (variants, PNG, ico 16/32/48, apple 180, 192, 512, maskable, manifest, head snippet) |
| Presentation / mockups | CSS-drawn board, industry presets | — | Photoshop / AI mockups | — | logo-design approach (original HTML/CSS mockups) + vector-vs-preview labelling → `vector-mockups.md` |
| Illustration | — | Raster backends only | Generator catalogue | — | **Gap filled**: `svg-illustration.md` (style systems, composition, layering, archetypes, light/dark, animation) |
| Icon systems | — | UI icons as SVG marks | — | Library + packages | **Gap filled** with original spec (keylines, stroke, pixel alignment, naming, UI weight matching) + discovery across Lucide/Phosphor/Tabler/Heroicons/Material/Kubai/FA |
| Raster → vector | Not covered | "Use Recraft" | Upscale → Vectorizer.ai (paid) → cleanup | — | **Gap filled**: free local `trace.py` + optional vtracer/potrace + box-method cleanup + honesty rules |
| Light/dark | Reversed export | Light/dark contact sheet | Mentions light/dark export | — | **Gap filled**: CSS-variable + `prefers-color-scheme` SVGs, or two files for sanitizers |
| WordPress / Elementor | — | — | — | Static SVG with baked colours | **Gap filled**: `wordpress-elementor.md` §10 |
| Provenance / IP | Trademark search, font licences | Manifest + IP reference | Risk matrix | License terms | Combined → `vector-engine.md` §7 |
| Paid generators | None | Recraft (paid), Canva Enterprise, Figma seats | Many paid SaaS | — | Low-credit ladder: consent + stated cost only |

## 3. Excluded and why
- The logo-design trademark library (1,432 brand logos): third-party trademarks; "study, never trace".
- The logo-design Python scripts: replaced by original Node tools that reuse the skill's existing Chrome pipeline, so no new runtime dependency.
- Paid tool catalogues as defaults (Recraft, Midjourney, Vectorizer.ai, Aspose, Topaz): cost and API dependency. They remain mentioned only as consented options.
- Kubai's method files and site/tools: their license forbids adaptation and redistribution.
- vpype (plotter optimisation) for logo cleanup: wrong tool for the job.

## 4. Licensing and attribution
- **kaankiziltug/logo-design-skill (MIT, © 2026 kaankiziltug):** methods and numbers (optics, construction rules, mark-type guide, web-icon set) re-expressed in original prose. No code or library files copied. Credit given here.
- **code-katz/claude-illustrate-skill (MIT, © 2026 Will Curran / Code Katz):** routing, inspect-loop and provenance ideas re-expressed. Credit given here.
- **designrique/ai-graphic-design-skill (MIT, © 2026 Henrique):** raster-to-vector pipeline concept and box-method cleanup re-expressed. Credit given here.
- **kubai087/kubai-icons:** only factual usage information about the MIT packages (names, props, index file). No icons or method text included. Projects using Kubai icons must keep the MIT notice of the packages.
- **External tools mentioned:** vtracer (MIT, optional), Potrace (GPL-2.0, external binary, not bundled), Inkscape (GPL, external). None are installed or bundled by this skill.
