# Frontend Design Quality (Implementation Craft)
Contents: 1. Stack detection · 2. CSS architecture · 3. Browser-surface details · 4. HTML semantics · 5. Performance · 6. Resilience · 7. React / Next.js specifics · 8. Code hygiene before handoff · 9. Maintainability score drivers  _(read only the section you need)_

How design survives contact with code. These rules apply to hand-written HTML/CSS/JS, React/Next.js, and any custom code inside a CMS.

## 1. Stack detection (before writing anything)
Inspect `package.json`, framework config files, CSS approach (Tailwind config, CSS modules, styled-components, plain CSS), component library, WordPress theme/child theme, Elementor version and Pro status, Shopify theme structure, build tooling. **Use what is there.** New dependencies need a clear payoff and must be mentioned to the user. Never introduce a framework or component library just because it's familiar.

## 2. CSS architecture
- All colors, fonts, spacing, radii, shadows, durations and easings go through tokens (custom properties or the framework's theme). No raw hex in components.
- Logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) for i18n/RTL readiness.
- `gap` for layout spacing. Flex/grid, not JS measurement, for layout.
- `min-width: 0` on flex/grid children with text; `minmax(0,1fr)` tracks.
- Specificity stays low. No `!important` except to override third-party code you can't change (comment why).
- Never `transition: all`.
- Layered z-index scale; overlays in a portal/top layer, not inside `overflow: hidden` parents.

## 3. Browser-surface details (cheap signals of craft)
Themed `::selection`, `caret-color`, `accent-color` for native controls, a styled focus ring (`:focus-visible`, 2px, offset 2px, brand color with ≥3:1 contrast), `text-underline-offset` on links, `scrollbar-gutter: stable` where layout shifts, `color-scheme`, `theme-color` meta, favicon + apple-touch-icon, real `<title>` and meta description, Open Graph image, a designed 404 page.

## 4. HTML semantics
Landmarks, one h1, ordered headings, lists for lists, `<button>` vs `<a>`, `<label for>`, `<fieldset>/<legend>` for groups, `<table>` with `<th scope>`, `<time datetime>`, `lang`. These are not just a11y; they are SEO and maintainability.

## 5. Performance (Core Web Vitals targets)
- LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Images: see `imagery-and-visual-storytelling.md` §7.
- Fonts: ≤2 families (+ an optional mono for data/code), only used weights, `font-display: swap`, preload critical files, self-host when possible.
- JS: ship as little as possible on marketing pages; defer non-critical scripts; lazy-load heavy components (maps, video, WebGL) near the viewport; code-split in SPAs.
- Virtualize lists >~50–100 items. Debounce search ~300ms, throttle scroll handlers or use IntersectionObserver.
- Mutations (POST/PATCH/DELETE) should feel instant: optimistic UI with rollback where safe; keep server round-trips <500ms.
- `content-visibility: auto` for long below-the-fold sections.
- Measure (Lighthouse CLI, browser performance panel) instead of guessing; fix the biggest bottleneck first.

## 6. Resilience
- Content visible without JS (no opacity-0-until-script reveals).
- Handle long text, empty data, slow network, errors, offline (see `accessibility-and-ux.md` §8).
- Hydration safety in SSR frameworks: deterministic render; guard dates/locale; no `value` without `onChange`.
- Clean up listeners, timers, observers and in-flight requests on unmount.
- Cross-browser: test Safari (iOS) for `backdrop-filter`, `position: sticky`, `100vh`, date inputs, and form autofill styling.

## 7. React / Next.js specifics (only when present)
- URL state for filters/tabs/pagination (search params). `<Link>` for navigation.
- Server Components for static content; client components only where interactivity is needed.
- `next/image` with correct `sizes`, `priority` on LCP image. `next/font` for fonts.
- Avoid per-frame state updates; use refs or a motion library's motion values for animation.
- Use the project's existing UI kit and patterns.

## 8. Code hygiene before handoff
No dead code, console logs, commented-out experiments, unused CSS, or duplicate tokens. Final diff reviewed for churn: changes should be scoped to the task. In CMS projects, no orphaned custom CSS snippets.

## 9. Maintainability score drivers
Tokens used consistently; components reused rather than copy-pasted; no magic numbers; clear naming; CMS content editable by non-developers; documentation of the system (DESIGN.md) kept current.
