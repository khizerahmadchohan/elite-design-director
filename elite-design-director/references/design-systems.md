# Design Systems and Tokens
Contents: 1. Token architecture · 2. Minimum token set · 3. DESIGN.md · Overview        — North Star name, the direction in a paragraph, key characteristics · Colors          — roles, where each is used and why; contrast pairs · Typography      — families + why; hierarchy table; principles; fallbacks/substitutes · Layout          — grid, container, spacing philosophy, section rhythm · Elevation & Depth — the one strategy; levels table · Shapes          — radius scale and assignment; image geometry · Components      — recipes + states; signature components · Motion          — durations, easings, what moves and what never does, reduced-motion policy · Do's and Don'ts — 6–10 checkable rules, each Don't paired with its Do · Responsive      — breakpoints, collapse strategy, touch targets, image behavior · Known Gaps      — what is undecided or unverified · 4. Extracting a system from existing code · 5. Extracting components · 6. Preserving existing brand rules  _(read only the section you need)_

Every project gets a system *before* section code. The system can be tiny (a `:root` block) or full (a DESIGN.md plus a component library), scaled to the job.

## 1. Token architecture (three layers)
1. **Primitive:** raw values. `--blue-600: oklch(0.52 0.16 255)`, `--space-4: 16px`. Never used directly by components.
2. **Semantic:** roles. `--color-primary: var(--blue-600)`, `--color-ink`, `--space-section`. Dark mode and themes remap *this* layer.
3. **Component:** optional. `--button-bg: var(--color-primary)`. Only for components that need theming hooks.

Components reference semantic tokens. Primitives never reference each other. Promote a value to a token only when it is reused or encodes a decision. Don't tokenize every number.

## 2. Minimum token set
- **Color:** roles from `typography-and-color.md` §B3, each fill with an `on-` / `-foreground` pair, plus state variants (hover/active/disabled) for interactive fills.
- **Typography:** 8–15 named styles (e.g., display-xl, display-l, heading-l/m/s, body-l/m/s, label, caption, button, mono, numeric). Each has family, size, weight, line-height, tracking, and optional features (`tnum`).
- **Spacing:** base-4 scale + section tier (section-s/m/l).
- **Radius:** 4–7 steps assigned to components (input sm, button md or pill, card lg, dialog xl, full). Or one deliberate extreme as identity (0px everywhere or pills everywhere). Nested radius rule: inner = outer − padding.
- **Elevation:** 3–6 levels with exact CSS, one strategy (see `layout-and-composition.md` §8).
- **Motion:** durations (fast ~120ms, base ~200ms, slow ~320ms, entrance ~500ms) and easings (`--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`, `--ease-drawer: cubic-bezier(0.32,0.72,0,1)`), plus the reduced-motion policy.
- **Breakpoints:** content-driven, typically 480 / 768 / 1024 / 1280 / 1536.
- **Z-index scale:** base 0, sticky 10, dropdown 20, overlay 40, modal 50, toast 60.
- **Focus:** ring width (2px), offset (2px), color (≥3:1 against both the component and the page).

## 3. DESIGN.md (the project's visual source of truth)
Create or update `DESIGN.md` at the project root for anything beyond a one-off fix. Never overwrite an existing one silently. Offer merge or refresh. Structure:

```markdown
---
name: <Project> Design System
colors:   { canvas: "#...", ink: "#...", primary: "#...", on-primary: "#...", ... }
typography:
  display-xl: { fontFamily: "...", fontSize: "clamp(...)", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.03em" }
  body-m:     { fontFamily: "...", fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 }
rounded:  { sm: "6px", md: "10px", lg: "16px", full: "9999px" }
spacing:  { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", section: "128px" }
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.button}", rounded: "{rounded.md}", padding: "12px 20px" }
---
## Overview        — North Star name, the direction in a paragraph, key characteristics
## Colors          — roles, where each is used and why; contrast pairs
## Typography      — families + why; hierarchy table; principles; fallbacks/substitutes
## Layout          — grid, container, spacing philosophy, section rhythm
## Elevation & Depth — the one strategy; levels table
## Shapes          — radius scale and assignment; image geometry
## Components      — recipes + states; signature components
## Motion          — durations, easings, what moves and what never does, reduced-motion policy
## Do's and Don'ts — 6–10 checkable rules, each Don't paired with its Do (Named Rules, e.g. "The One Accent Rule")
## Responsive      — breakpoints, collapse strategy, touch targets, image behavior
## Known Gaps      — what is undecided or unverified (prevents agents from inventing specifics)
```

Writing rules: describe first, then give the exact value in parentheses. Explain where and why, not just what. Don't duplicate values between frontmatter and prose. Use `{group.token}` references. Name colors descriptively in prose ("deep bay-floor graphite"), with tokens by role.

**Platform mapping:** on Elementor, mirror the color and type tokens 1:1 as Global Colors and Global Fonts (or V4 variables/classes) and record the mapping table in DESIGN.md. On Shopify, map them to theme settings. On Tailwind v4, use `@theme`. With shadcn, see `component-patterns.md` §shadcn.

## 4. Extracting a system from existing code
1. Inventory in priority order: CSS custom properties, Tailwind theme, CSS-in-JS theme, token JSON, Elementor Kit (Site Settings → Global Colors/Fonts, `elementor_active_kit` post meta), theme.json (block themes), component library, then computed styles of body/h1/h2/a/button/card in the rendered page.
2. Cluster near-duplicate values (e.g., 7 grays within ΔL 2% → 1 token). List hardcoded one-offs.
3. Map to roles. Mark gaps ("no focus token", "no danger color").
4. Propose a consolidated set. Migrate only with agreement on a live project.

## 5. Extracting components
Extract a component when a pattern repeats **3+ times with the same intent**. Premature abstraction is worse than duplication. Don't merge look-alikes that serve different purposes. Build the enriched version with all states and accessibility, migrate all instances, delete the old code, and document.

## 6. Preserving existing brand rules
On redesigns: existing logo, brand colors, brand fonts and any written guidelines are constraints unless the user requests a new identity. You may tune *usage* (tints, proportions, hierarchy) and add missing roles (focus, states, semantic colors). Record every change to a brand value and the reason.
