# Accessibility and UX
Contents: 1. Perceivable · 2. Operable · 3. Understandable · 4. Robust · 5. Mobile and input · 6. Usability heuristics · 7. UX writing · 8. States and resilience  _(read only the section you need)_

Target: **WCAG 2.2 AA** as the floor, plus usability heuristics. Accessibility failures are hard gates. They are never offset by visual quality.

## 1. Perceivable
- Text contrast ≥4.5:1; large text ≥3:1; UI components, icons, focus indicators and meaningful graphics ≥3:1 (SC 1.4.3, 1.4.11).
- Never color alone (1.4.1): status, errors, links in body text (underline or another non-color cue), and chart series.
- Text alternatives: meaningful images get concise `alt` describing purpose; decorative images get `alt=""`/`aria-hidden`; icon-only buttons get `aria-label`; complex charts get a text summary or data table.
- Reflow at 320px CSS width without horizontal scroll (1.4.10). Text spacing overrides don't break layout (1.4.12). 200% zoom keeps everything usable (1.4.4).
- Never disable zoom (`user-scalable=no` and `maximum-scale=1` are forbidden).
- Video: captions; audio: transcripts; no autoplay with sound; moving content >5s is pausable (2.2.2).
- Content on hover/focus (tooltips) is dismissible, hoverable and persistent (1.4.13).

## 2. Operable
- Everything works by keyboard (2.1.1) with no traps (2.1.2). Tab order follows visual order (2.4.3). DOM order matches reading order.
- **Visible focus** on every focusable element (2.4.7) using `:focus-visible`, never `outline: none` without a replacement. Focus is not obscured by sticky headers/footers or overlays (2.4.11). Use `scroll-margin-top` for anchored targets under sticky headers.
- Skip link to main content. Landmarks: `header`, `nav`, `main`, `footer`.
- Target size ≥24×24px minimum (2.5.8) with spacing; aim for **≥44×44px on touch** (Apple HIG/AAA), 48dp on Android. Expand small visual targets with padding or pseudo-elements.
- Dragging movements have a single-pointer alternative (2.5.7).
- Focus management: modals trap and return focus, route changes move focus to the new heading or main region, and deleted items move focus to a sensible neighbor.
- No keyboard shortcuts on single characters without a way to disable or remap them (2.1.4).

## 3. Understandable
- `lang` on `<html>`. Page `<title>` reflects context. One `h1`; headings are hierarchical, with no skipped levels.
- Consistent navigation and consistent identification of repeated components (3.2.3, 3.2.4).
- Labels or instructions for inputs (3.3.2). Errors are identified in text and suggest a correction (3.3.1, 3.3.3). Important submissions can be reviewed or reversed (3.3.4).
- Don't ask for the same information twice in a flow (3.3.7). Accessible authentication: allow paste and password managers, no cognitive puzzles (3.3.8).
- Help mechanisms appear in a consistent place (3.2.6).

## 4. Robust
- Semantic HTML before ARIA. Buttons are `<button>`, links are `<a href>`, lists are lists, tables are tables with headers.
- ARIA only to fill gaps, following APG patterns. Accessible name, role, state and value present (4.1.2). Status messages use `role="status"`/`aria-live` (4.1.3).
- Check the accessibility tree, not just the visual.

## 5. Mobile and input
- Body text ≥16px on mobile (also prevents iOS input zoom). Inputs ≥16px.
- Thumb zone: primary actions reachable at the bottom on mobile apps. Sticky mobile CTAs don't cover content or focus.
- `touch-action: manipulation` on controls; set `-webkit-tap-highlight-color` deliberately and provide `:active` feedback.
- Use the correct virtual keyboard (`inputmode`, `type=email/tel/number`) and `autocomplete` tokens.
- Safe areas: `viewport-fit=cover` + `env(safe-area-inset-*)` for fixed bars.

## 6. Usability heuristics (scoring lens)
Use Nielsen's 10 for critique: visibility of system status; match with the real world; user control and freedom (undo, cancel, back); consistency and standards; error prevention; recognition over recall; flexibility and efficiency; aesthetic and minimalist design; error recovery; help and documentation.

**Cognitive load checks:** one primary focus per view; ≤4 items per chunk; ≤4–5 visible options per decision; progressive disclosure for advanced options; no memory bridges (don't make users remember info from a previous screen); plain language, no jargon.

**Personas for stress-testing** (pick 2–3 relevant):
- *First-timer:* is the first action obvious within 5 seconds? Are icons labeled? Any jargon?
- *Power user:* core task in under a minute? Shortcuts, bulk actions, Esc closes overlays?
- *Keyboard / screen-reader user:* full keyboard path, announced state changes, 200% zoom.
- *Distracted mobile user:* thumb reach, slow 3G, interrupted sessions, state persistence.
- *Stress tester:* empty data, 1,000 items, very long names, emoji, RTL, refresh mid-flow, double-click submit.

## 7. UX writing
- Specific labels: verb + object, describing the outcome ("Save changes", "Send invoice").
- Errors: what happened, why (if useful), how to fix. No internal codes as the primary message, no blame. Never joke about money, privacy or loss.
- Destructive actions name the object and consequence. Prefer undo.
- Loading copy names the operation ("Uploading 3 photos…"). Empty states guide the next action.
- Link text makes sense out of context (no "click here").
- Consistent terminology: keep a glossary and never vary terms for style.
- Write whole translatable strings (no string concatenation). Use `Intl` APIs and proper plural rules.

## 8. States and resilience (harden)
Design and test: empty, loading, partial, error, offline, success, permission-denied, very long content (100+ char names), very large numbers, 1,000+ items (paginate/virtualize), RTL, 30–40% text expansion for translations, slow network, and double-submit. Map HTTP errors to UI: 400 → field validation, 401 → re-authenticate, 403 → permission message, 404 → not-found state, 429 → rate-limit with retry timing, 5xx → generic message + retry + support path.
