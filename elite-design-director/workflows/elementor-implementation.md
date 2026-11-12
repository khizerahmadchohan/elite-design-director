# Workflow: Elementor Implementation

Design is decided by the other workflows. This workflow turns it into a native, editable Elementor build. Full rules: `references/wordpress-elementor.md`.

1. **Safety check.** Identify whether the target is live, staging or local. Default to drafts/new pages and preview links. Get explicit permission before publishing, editing a live page, or changing site-wide Globals/Kit settings.
2. **Inspect** (reference §1): versions, Pro, containers, V4 atomic features, theme, Kit globals, Theme Builder parts, plugins (forms, Woo, caching, addons), existing page structure. With an Elementor MCP connected, use its read tools (page structure, global variables, classes, widget schemas, default styles).
2b. **Absorb the site visually:** preview screenshots `--full` of the homepage and target page, the Site Language Sheet and rhythm map (`references/site-consistency.md`). For new pages or sections, the design workflow's research step runs before this (`references/visual-research.md`).
3. **Map tokens → Globals** (reference §2). Present the mapping table. Reuse existing globals; add role-named ones for gaps. Set Theme Style defaults for headings, body, buttons, form fields and links.
4. **Plan the structure** per section as a container tree: outer container (full/boxed, HTML tag, padding per breakpoint) → inner layout (flex/grid, gap) → native widgets. Identify reusable pieces: Theme Builder header/footer, saved templates, Loop Grid templates for repeated content, global widgets/components.
5. **Build** on a draft/new page or via the MCP's composition tools. Every color/font is a Global reference; spacing comes from the documented scale; semantic heading tags; alt text; real links.
6. **Responsive pass** with per-breakpoint controls (Desktop / Tablet / Mobile plus custom breakpoints). No duplicated per-device sections.
7. **Minimal custom CSS** only where native controls can't do it (reference §4), scoped, commented, referencing `--e-global-*` variables. Add reduced-motion handling if entrance animations are used.
8. **Preview and verify:** preview link → `scripts/shoot.mjs` at 390/768/1280/1440 (+ `--around` the new section and `--full`) → `checklists/consistency-audit.md` → `checklists/responsive-audit.md` + `accessibility-audit.md` → test forms, links, popups, dynamic content, WooCommerce flows. Check with caching/optimization plugins active (clear caches).
9. **Editability check:** confirm that the owner can change text, images, colors and fonts from the editor without code. No HTML-widget rebuilds of things native widgets can do.
10. **Handoff:** change log (globals added/changed, templates created, custom CSS added with location), scorecard, hard gates, items for the owner to replace, and publish status (published only if permitted).
