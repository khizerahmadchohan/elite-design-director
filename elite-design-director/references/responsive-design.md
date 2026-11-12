# Responsive Design
Contents: 1. Method · 2. Test widths · 3. Rules · 4. Platform notes · 5. Verification  _(read only the section you need)_

"Rethink, don't just scale." Each breakpoint is a design decision about what matters on that device.

## 1. Method
- **Mobile-first CSS** (`min-width` queries). Design the narrowest layout deliberately; it is not a squashed desktop.
- **Content-driven breakpoints:** add one where the layout breaks, not at device names. Typical set: 480, 768, 1024, 1280, 1536.
- **Container queries** for components reused in different widths (cards, sidebars, widgets).
- Fluid type and space with `clamp()` for marketing surfaces; fixed steps for app UI.

## 2. Test widths (always)
320 (reflow floor), 375/390 (common phones), 768 (tablet portrait), 1024 (tablet landscape / small laptop), 1280–1440 (laptop/desktop), 1920 (wide). Also test landscape phone (≈844×390) for hero and nav.

## 3. Rules
- **No horizontal scroll** at any width. Use `overflow-x: clip` on html/body only as a safety net, never as the fix. Avoid `100vw` (it includes the scrollbar). Find the overflowing element.
- Viewport units: `100svh` for marketing heroes, `100dvh` for app shells, never bare `100vh` on mobile.
- **Text:** body ≥16px on mobile; prose measure 35–60ch on mobile, 60–75 on desktop; display sizes scale down through `clamp()` so headlines don't break into one word per line; check that no word overflows its container (long German or URL strings get `overflow-wrap: anywhere` in narrow cells).
- **Navigation:** stages from full horizontal nav → condensed → menu button. The mobile menu has an accessible name, is reachable at the top, traps focus when open, and closes with Esc. Bottom tab bar for 3–5 app destinations.
- **Touch:** targets ≥44px with ≥8px between them; no hover-dependent functions; sticky mobile CTA bars must not cover content, cookie banners or focus.
- **Grids:** 12 → 8 → 4 columns; multi-column card rows collapse to 2 then 1, or become horizontal scroll-snap rows with a visible next-card peek (only for browsable, non-essential sets).
- **Tables:** stacked rows with labels, or a scrollable region with a frozen first column and a visible scroll affordance.
- **Images:** art-directed crops for heroes; consistent aspect ratios per row; `sizes` set correctly so phones don't download desktop images.
- **Spacing:** section padding shrinks ~40–60% on mobile; gutters 16–20px on phones.
- **Order:** on mobile the most important content comes first. Don't hide essential content; collapse it into accordions or tabs if needed. DOM order stays logical when CSS reorders visually.
- **Forms:** single column on mobile, full-width inputs, correct keyboards, labels above fields.
- **Safe areas:** `env(safe-area-inset-*)` for fixed headers, bottom bars and full-bleed media on notched devices.
- **Wide screens:** a capped container; full-bleed bands are fine but content within them stays capped; line lengths never exceed the measure.
- **Print** (documents, invoices, recipes): print stylesheet hides nav, shows URLs, avoids breaks inside items.

## 4. Platform notes
- **Elementor:** use native responsive controls per breakpoint (Desktop / Tablet / Mobile, plus any custom breakpoints configured in Site Settings → Layout). Set container direction, gap, padding and typography per device instead of hiding duplicate sections per device (duplicated content hurts SEO and maintenance). Use "Hide on device" only for genuinely different elements (e.g., a mobile-only call button). See `wordpress-elementor.md`.
- **Shopify:** theme sections must respond within their own CSS; test the theme editor preview at mobile.
- **Tailwind:** mobile-first prefixes (`md:`, `lg:`); container queries via `@container`.

## 5. Verification
Run `scripts/shoot.mjs` at the test widths and review every screenshot. Look for: overflow, text collisions, broken line breaks, illegible text on images, giant gaps, tiny targets, nav failures, sticky element overlap. Check landscape phone. If possible, test on a real device for touch, keyboard and safe-area behavior (emulation misses these), and state when you couldn't.
