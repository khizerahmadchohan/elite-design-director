# Vector Graphics & Illustration Engine (hub)
Contents: 1. Route the asset · 2. Low-credit ladder · 3. Vector truth rules · 4. SVG authoring standard · 5. Context first · 6. Render-and-inspect loop · 7. Provenance · 8. Tools  _(read only the section you need)_

One engine for logos, illustrations, icon systems, tracing and brand-asset presentation. Specialised detail lives in: `logo-design.md`, `svg-illustration.md`, `icon-systems.md`, `raster-to-vector.md`, `vector-mockups.md`, and `wordpress-elementor.md` §10. Workflows: `workflows/logo-creation.md`, `workflows/vector-asset-production.md`. Gate: `checklists/vector-quality-audit.md`.

## 1. Route the asset (say the class out loud)
| Asset class | Track | Default output |
|---|---|---|
| Logo, wordmark, monogram, emblem, favicon, app icon | **Logo track** (`logo-design.md`) | Hand-authored SVG masters + variant kit |
| UI icons, icon sets | **Icon track** (`icon-systems.md`) | Library first, then original SVG matched to the set |
| Hero/feature/section illustrations, diagrams, isometric, mascots, patterns | **Illustration track** (`svg-illustration.md`) | Hand-authored SVG, layered and named |
| Client raster logo/art to vector | **Trace track** (`raster-to-vector.md`) | Traced paths + cleanup, or a redraw |
| Photoreal scenes, painterly art, textures | **Raster track** (not vector) | Photography or a consented generator. Say it is raster |
| Social cards, banners, presentation boards | **Layout track** | HTML/CSS/SVG composition (`vector-mockups.md`) |

## 2. Low-credit ladder (cheapest adequate step wins)
1. Reuse the project's existing assets or icon family.
2. A permissively licensed library (icons) found through the discovery workflow.
3. **Author the SVG directly**: geometry described in words, then coded.
4. Local tools: `scripts/trace.py` (tracing), `scripts/svgcheck.mjs` (validate, render, optimise), `scripts/svgexport.mjs` (variants, PNG, favicons).
5. Paid or external generators (e.g. Recraft for vector, Firefly/others for raster): **only** when the requested complexity genuinely needs them, **with user consent**, and with the cost stated. Never call an external API when clean SVG can be authored.

Let scripts do repeatable checks. Spend model attention on judgment, not on things a script can verify.

## 3. Vector truth rules (non-negotiable)
- **A PNG/JPG inside `<image>` is not a vector.** `svgcheck` fails it. Never deliver one as "SVG artwork".
- Say which deliverables are **editable vector** and which are **raster previews** (mockups, renders).
- Photographs and soft-gradient art can't be faithfully vectorised. Offer a stylised redraw or keep them raster, and say so.
- Live `<text>` is allowed in exploration only. Finals use outlined letterforms or a licensed font converted to paths (check that the font license permits logo use).
- Never claim a render or a test that you didn't run.

## 4. SVG authoring standard (all tracks)
- **Root:** `xmlns`, `viewBox` (always), no fixed width/height on masters (or matching ratio), `role="img"` + `<title>` (+ `aria-labelledby`) for meaningful art, `aria-hidden="true"` for decorative.
- **Canvas:** logo symbols `0 0 256 256` (lockups keep height 256, width follows). Icons `0 0 24 24`. Illustrations sized to their slot ratio (e.g. `0 0 1200 800`).
- **Coordinates:** integers or 1–2 decimals. Snap key geometry to a grid unit (8 or 16 on 256; 1 or 0.5 on 24).
- **Structure:** named groups (`<g id="symbol">`, `<g id="wordmark">`, `<g id="bg">`, `<g id="fg">`…). Ids are prefixed per asset (`acme-grad-1`) so several inlined SVGs don't collide.
- **Paths:** anchors at extrema, horizontal/vertical handles, minimum nodes. Arcs (`A`) for circular geometry; quarter-circle Bézier handle = 0.5523 × r. Holes via one path with `fill-rule="evenodd"`. Merge touching same-colour shapes (no hairline seams).
- **Colour:** fills on elements or via CSS custom properties for themeable art. `currentColor` for UI and mono variants. Gradients use `gradientUnits="userSpaceOnUse"`, and a flat version is always kept.
- **Masters:** no filters, masks, clipPaths, live text or rasters. Exploration and illustrations may use masks/clips/gradients when they stay sanitizer-safe and render correctly.
- **Never** `<script>`, `on*=` attributes, external `href`s or `<foreignObject>` (unsafe; stripped by WordPress sanitizers).
- **Size budgets:** icon < 2 KB, logo < 15 KB, illustration usually < 80 KB. Run `svgcheck --optimize`.

## 5. Context first (never judge a vector asset in isolation)
Before drawing for an existing site, read its Site Language Sheet (`site-consistency.md`): palette, type, radius, line weight, existing icon family, illustration style, where the asset sits and how big it is.
- The asset uses the site's tokens (stroke weight relative to UI icons, corner radius echoing the components, palette roles).
- **Verify in place:** render the page with the asset at its real size (`shoot.mjs --around`) and judge it next to its neighbours, not only on a blank canvas.
- Section-level and page-level consistency apply to graphics too (`consistency-audit.md`).

## 6. Render-and-inspect loop
1. Author 3–5 structurally distinct concepts. If they share a silhouette, they count as one.
2. `node scripts/svgcheck.mjs <files> [--set] --out <dir>` validates, then renders a contact sheet at 16/24/32/64/256 on light and dark. **Read the PNG.**
3. Name the **single worst failure** per concept and fix only that.
4. Re-render. At least 2 and at most 3 passes per concept. If a pass improves nothing, the concept is wrong: kill it.
5. Final: `checklists/vector-quality-audit.md`, then check it in context (§5).

## 7. Provenance
Keep `assets/MANIFEST.md` in the project (or a section in the handoff): `Asset | Method (hand-authored / traced from X / library Y / generator Z+model) | Date | License | Commercial use (yes/no/verify) | Source or prompt`. An asset without provenance is a comp, not a deliverable. Hand-authored SVG strengthens authorship. Purely AI-generated output may not be copyrightable, so recommend a trademark search before a logo is registered.

## 8. Tools (all local, no npm installs)
| Script | Does |
|---|---|
| `svgcheck.mjs` | Parse/validate in Chrome; viewBox, ratio, raster embeds, unsafe content, broken refs, duplicate ids, clipping, centring, stroke/fill census, small-size anti-alias ratio; `--set` consistency; `--optimize`; contact sheet PNG (currentColor resolved to ink on light and white on dark). Intentional edge bleed: add `data-edd-allow="bleed"` on `<svg>` |
| `svgexport.mjs` | Feed the **full-colour master**. Variants (black, white, mono #hex, currentColor), `--themes` (bakes `-light`/`-dark` SVGs from CSS custom properties, for sanitizers), PNG sizes, web-icon kit (favicon.ico 16/32/48, apple-touch 180, 192, 512, maskable 512, webmanifest, `<head>` snippet), `--favicon-source` |
| `trace.py` | Raster to genuine vector paths (Pillow only). Optional `--engine vtracer` if the user installs vtracer |
| `shoot.mjs --around` | See the asset in its real page context |
