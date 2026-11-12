# WordPress and Elementor Implementation
Contents: 1. Inspect before touching anything · 2. Tokens → Elementor globals · 3. Building pages natively · 4. When custom CSS/JS is justified · 5. Preserving editability · 6. WooCommerce · 7. Performance on Elementor · 8. Elementor workflow summary · 8b. Elementor MCP settings quirks · 9. Other platforms  _(read only the section you need)_

Translate design intelligence into **native** platform capabilities. The site owner must be able to edit everything afterward in the normal editor. A React component cannot be installed into Elementor, and a pasted HTML blob is not an Elementor page.

## 1. Inspect before touching anything
1. **Versions and capabilities:** WordPress version, Elementor and Elementor Pro versions (Pro unlocks Theme Builder, Popups, Loop Grid, Forms, Custom CSS, Dynamic Tags, Custom Fonts), whether the **Flexbox/Grid Container** experiment is active (default in modern versions), and whether the **V4 / atomic editor** features (Classes, Variables, Components, atomic widgets) are active on this site.
2. **Theme:** Hello Elementor (blank canvas), a child theme, or a full theme (Astra, GeneratePress, Kadence…) that also sets typography and colors. Note which layer currently owns fonts and colors.
3. **The active Kit (Site Settings):** Global Colors, Global Fonts, Theme Style (typography, buttons, images, form fields), Layout (content width, container padding, breakpoints, including custom ones), Custom CSS, and site identity. Check "Disable Default Colors/Fonts" settings so the Kit applies.
4. **Theme Builder parts:** header, footer, single post/page, archive, product (WooCommerce), search, 404, and popups, with their display conditions.
5. **Plugins:** forms (Elementor Forms, CF7, Gravity, WPForms), WooCommerce, SEO plugin, caching/optimization (WP Rocket, LiteSpeed, Autoptimize, which can break CSS/JS changes), addon packs (Essential Addons, JetElements, Crocoblock), multilingual (WPML/Polylang), and analytics/tag managers.
6. **Existing structure of the page:** containers and nesting, widget types, saved templates and global widgets/components in use, dynamic tags, custom CSS classes and IDs referenced by scripts or tracking.

If an **Elementor MCP server** is connected, use its read tools first: list posts, get page structure, list/get global variables and classes, get default styles, and widget schemas. Use its write tools only on drafts, new pages or preview copies. Create a preview link for review. **Never publish or edit a live client page without explicit permission for that specific action.**

## 2. Tokens → Elementor globals
Map the design system 1:1 and record the mapping in DESIGN.md:
| Design token | Elementor V3 | Elementor V4 (atomic) |
|---|---|---|
| primary, secondary, ink, accent | System colors: Primary, Secondary, Text, Accent | Global color variables |
| canvas, surface, border, success, danger, etc. | Custom Global Colors with role names ("Surface 2", "Border", "Danger") | Color variables |
| display / heading / body / label styles | System fonts: Primary (headings), Secondary, Text (body), Accent (buttons/labels), plus custom Global Fonts per style ("Display XL", "Heading M", "Body", "Label") with responsive size, weight, line-height, letter-spacing | Font variables + typography in Classes |
| spacing / radius / sizes | Container padding/gap set per breakpoint (no native spacing tokens in V3; use a documented scale and, where needed, CSS custom properties in Site Settings → Custom CSS) | Size variables |
| component recipes | Theme Style (buttons, form fields, images) + saved templates / global widgets | Classes (with states) + Components |

Rules:
- **Every widget color and typography references a Global**, never a raw value. This is what makes future rebranding a one-click change.
- Name globals by **role**, not hue ("Primary", "Ink Secondary", not "Blue 2").
- Set Theme Style defaults (H1–H6, body, links, buttons, form fields) so new content inherits the system automatically.
- **Kit and Theme Builder changes have no draft state.** Global Colors/Fonts, Theme Style and Theme Builder templates go live site-wide immediately. Safe order: (1) export the Kit (Tools → Export/Import Kit, or Templates → Kit) and take a full site backup; (2) prefer a staging copy (most hosts offer one-click staging); (3) on a live site, *add* new role-named globals first and use them on draft pages, then switch the old values only after review; (4) build new Theme Builder templates unpublished, or with display conditions limited to a test page, then widen the conditions.
- **Old Sections/Columns pages:** Elementor offers a per-section "Convert" to container action. Convert on a copy of the page, then check spacing and responsive settings, which often shift.
- Respect existing globals on redesigns. Update their values only when the user wants a re-skin, because changing a Global changes it site-wide.
- Avoid double font loading: if the theme loads a font and Elementor loads it too, disable one (Elementor → Settings / theme customizer). Use the Kit's Custom Fonts for self-hosting when the brand font isn't on Google, and consider Elementor's local Google Fonts loading for privacy/performance.

## 3. Building pages natively
- **Containers, not sections/columns** (on modern sites). Use Flexbox containers for one-dimensional rows and stacks, Grid containers for two-dimensional layouts. Keep nesting shallow (≤3–4 levels). Every extra wrapper is DOM weight and editing friction.
- Set **Content Width** (boxed vs full width) on the outer container. Full-bleed color/photo bands are full-width outer containers with a boxed inner container capped at the Kit's content width.
- Spacing via container **gap and padding**, using values from the documented scale per breakpoint. Avoid margin hacks and spacer widgets.
- Use native widgets: Heading, Text Editor, Image, Button, Icon List, Nav Menu, Form, Tabs, Accordion/Nested Accordion, Nested Tabs, Loop Grid/Carousel, Testimonial, Google Maps, Video, Posts, WooCommerce widgets. Prefer **nested** widgets (Nested Tabs/Accordion/Carousel) for rich content, since their content is editable containers.
- **Dynamic content:** Dynamic Tags (site title, post data, ACF/JetEngine fields) and Loop Grid templates for repeating content (services, team, vehicles, locations) instead of hand-built repeated cards. This is native "componentization".
- **Reuse:** saved templates for repeated sections, global widgets/components for elements that must stay identical (e.g., a booking CTA), and Theme Builder parts for header/footer/archives/single templates with display conditions.
- Semantic HTML: set heading widgets' HTML tag correctly (one H1 per page, hierarchical H2/H3); set container HTML tags (header, main, section, footer, nav) where available; give links real URLs; add alt text in the media library.
- **Responsive:** use the per-breakpoint controls (Desktop, Tablet, Mobile, plus any custom breakpoints in Site Settings → Layout → Breakpoints): direction, wrap, gap, padding, alignment, typography, image sizes. Use "Hide on" only for genuinely different device content (a mobile call button). Never duplicate whole sections per device.
- **Motion:** Elementor's Entrance Animations and Motion Effects are coarse. Use at most one authored entrance per page; prefer none on Operate pages; never "fade in up" on every widget. Respect reduced motion (Elementor's built-in animations don't always; add a reduced-motion rule in Site Settings → Custom CSS if animations are used). Elementor hides animated widgets with `.elementor-invisible` until the animation starts, so a naive `animation: none` can leave them invisible. Use:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .elementor-invisible { visibility: visible !important; opacity: 1 !important; }
    .elementor-element.animated, .elementor-motion-effects-element { animation: none !important; transition: none !important; transform: none !important; }
  }
  ```
  Verify with `shoot.mjs --reduced-motion` that nothing stays hidden.
- **Caching:** after CSS or global changes, regenerate Elementor CSS (Elementor → Tools → Regenerate CSS & Data), purge the cache plugin and CDN, and re-test with combine/minify/delay-JS optimizations active. Delayed JS can break forms, sliders and entrance animations, which is another reason to avoid entrance animations.
- **Forms:** note that Theme Style → Form Fields styles only **Elementor Forms**. Third-party forms (WPForms, CF7, Gravity, Fluent) ignore it: style them through the plugin's own style settings/blocks, or a small scoped CSS block using the Elementor globals, and leave the form markup and field IDs untouched. Use Elementor Forms (Pro) or the existing form plugin. Visible labels (not placeholder-only), required markers, proper field types, success/error messages written properly, and preserve existing form actions (email, webhook, CRM integrations) exactly.
- **Popups:** only with a clear trigger and purpose; accessible close button; Esc closes; not on page load for first-time mobile visitors.

## 4. When custom CSS/JS is justified
Only when no native control exists, for example themed `::selection`/focus rings, `text-wrap: balance`, tabular numerals, `aspect-ratio`, a reduced-motion override, a subtle hover effect, or fixing a theme conflict. Then:
- Put site-wide rules in **Site Settings → Custom CSS** (Pro) or the child theme's stylesheet. Put element-specific rules in the element's **Custom CSS** using `selector` (Pro), or a CSS class added in Advanced → CSS Classes.
- Use CSS custom properties that reference Elementor globals, so custom CSS follows the Kit. System globals have stable names: `--e-global-color-primary|secondary|text|accent` and `--e-global-typography-primary-font-family` (similarly `-font-size`, `-font-weight`, `-line-height`, and so on). **Custom** globals get a generated ID (`--e-global-color-1a2b3c4`), not a role name. Inspect the rendered CSS (or the Kit's post CSS) to find each ID, and record the ID→role mapping in DESIGN.md. Never guess the ID.
- Keep it small, commented, and scoped. Never rebuild a section as an HTML widget with inline styles when containers and widgets can do it.
- JS: avoid. If necessary, enqueue via the child theme or a code-snippets plugin, never inline per page, and make sure it works with caching/optimization plugins.

## 5. Preserving editability (the core promise)
- The owner can change text, images, colors and fonts from the editor without touching code.
- No hardcoded content inside CSS (`content:` text) or JS.
- Existing CSS classes/IDs used by tracking, anchors or scripts stay.
- Existing widgets that work (forms with integrations, booking plugins, WooCommerce flows, sliders the owner uses) are restyled through globals and style controls, not replaced, unless replacement is agreed.
- Document what changed: globals updated, templates created, custom CSS added (where and why).

## 6. WooCommerce
Use Theme Builder product, archive, cart, checkout and my-account templates (Pro) or the theme's WooCommerce templates. Style via Theme Style and WooCommerce widget controls. Don't break checkout fields, payment gateways or hooks used by plugins. Test add-to-cart, variation selection, cart update, checkout on mobile, and transactional emails' visual consistency (via WooCommerce email settings).

## 7. Performance on Elementor
Enable Elementor's performance features where safe (optimized DOM output, improved asset loading, inline font icons, lazy-load background images, optimized Google Fonts loading). Limit addon packs, fonts and weights. Compress images and set responsive image sizes. Avoid heavy motion effects and background videos on mobile. Verify the site with caching plugins active and clear caches after changes.

## 8. Elementor workflow summary
1. Inspect (§1) → 2. Map tokens to globals (§2), with approval if site-wide → 3. Build/restyle on a draft or a new page with native containers/widgets (§3) → 4. Minimal custom CSS (§4) → 5. Preview link + screenshots at Desktop/Tablet/Mobile breakpoints → 6. Verify forms/links/dynamic content still work → 7. Handoff with a change log; publish only with permission.

## 8b. Elementor MCP settings quirks (verify before relying on them)
Observed with the community `elementor-mcp` server (via the MIT claude-elementor-kit notes). The tools connected here have different names and schemas, so **read the target widget's schema first** (`elementor-get-widget-schema`, read-only) and confirm each key:
- Group controls need their switch key set, or the sub-keys are silently ignored: typography needs `typography_typography: "custom"` before `typography_font_family`/`_size`/`_weight`; background needs `background_background: "classic"` (or `gradient`) before color or image; the same applies to overlays and CSS filters.
- Flex container keys are prefixed (`flex_direction`, `flex_justify_content`, `flex_align_items`, `flex_gap` as `{column,row,unit,isLinked}`).
- Dimension objects (padding/margin) need `isLinked:false` when sides differ; units are explicit.
- Opacity-type sliders may take `{unit:"px", size:0–1}`, where the unit is nominal.
- Prefer global references (`__globals__`) over raw values, so Kit changes propagate.
- After writes, read the page structure back and screenshot the preview: silent ignores are the main failure mode.
- The client must restart after a new MCP server is added to the config.

## 9. Other platforms (same principle: native first)
- **WordPress block themes (Gutenberg/FSE):** tokens in `theme.json` (palette, typography presets, spacing scale, layout widths); block patterns and template parts for reuse; block styles over custom CSS.
- **Shopify:** sections/blocks with schema settings, theme settings for colors and typography, JSON templates; merchant-editable in the theme editor; no hardcoded content in Liquid.
- **Webflow/Framer/others:** use their native style system (classes/variables/components).

## 10. Vector assets in WordPress / Elementor
- **SVG uploads are not enabled by default** in WordPress (security). Check first: Elementor → Settings → Advanced → "Enable Unfiltered File Uploads" (admin-only; Elementor sanitizes on upload), or a sanitizing plugin such as Safe SVG. Never install or enable these on a live site without the owner's permission, and never suggest disabling sanitization.
- **Ship sanitizer-safe SVG:** no `<script>`, `on*=` handlers, `<foreignObject>` or external `href`s. Some sanitizers strip `<style>` and `<use>` references to external files. `svgcheck.mjs` flags all of these. Keep `viewBox`, remove fixed width/height (or keep the ratio), and keep ids unique per asset.
- **Where each asset goes (native first):**
  - Logos: Site Identity / Theme Builder header **Site Logo** widget (SVG or a 2× PNG fallback). Favicon: Site Identity **Site Icon** (512×512 PNG; WordPress generates sizes). Our `favicon/` kit is for non-WP sites or a custom `<head>` snippet.
  - Icons: **Icon / Icon Box / Icon List / Button** widgets → "Upload SVG" (inline), or **Custom Icons** (Elementor Pro: upload a Fontello/IcoMoon/Fontastic set, which keeps a whole family editable in one place). Icons using `currentColor` inherit the widget's colour control; baked colours don't. Prefer `currentColor` line icons.
  - Illustrations: **Image** widget (SVG from the Media Library, alt text set) for static art; scales with the container width. Use **HTML widget inline SVG** only when CSS theming or animation needs inline markup, and keep it in a saved template or global widget so it isn't duplicated per page.
  - Backgrounds/patterns: container background image (SVG) or a tiny CSS `background-image` in Site Settings → Custom CSS.
- **Responsive scaling:** set width per breakpoint in the widget (%, vw or max-width), never fixed px heights. For art-directed mobile versions, use two Image widgets with "Hide on" only when the composition truly differs.
- **Theming:** for light/dark sections, export `-light.svg` and `-dark.svg` (sanitizers may strip `<style>` media queries) and pick per section. Or use `currentColor` icons coloured by Elementor Global Colors.
- **Replaceability:** consistent file names, one asset per Media Library item, used through global widgets/templates. Swapping the file updates every usage.
- **Performance:** keep files small (`svgcheck --optimize`); avoid huge inline SVG in many places; lazy-load large illustrations as images.
