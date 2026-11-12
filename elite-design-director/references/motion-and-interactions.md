# Motion and Interaction
Contents: 1. The frequency gate · 2. Easing · 3. Duration · 4. Physicality · 5. Choreography · 6. Hover and touch · 7. Gestures · 8. Springs · 9. Performance · 10. Reduced motion · 11. Effect selection · 12. Motion review format  _(read only the section you need)_

Motion must do a job: acknowledge input, explain a state or spatial change, preserve continuity, direct attention, or (rarely) delight. "It looks cool" is not a job on a frequently-used element.

## 1. The frequency gate (decide first)
| How often the user sees it | Decision |
|---|---|
| 100+ times/day, or keyboard-initiated (shortcuts, command palette, list navigation) | **No animation.** Instant. |
| Tens of times/day (hover, tabs, toggles) | Minimal: color/opacity, ≤150ms |
| Occasional (modals, drawers, toasts, accordions) | Standard motion (below) |
| Rare/first-time (onboarding, success, launch moments) | The only place for delight |

Choosing not to animate is a valid outcome. **Removal test:** if removing the animation loses no meaning, it was decoration.

## 2. Easing
- Entering/exiting: **ease-out** `cubic-bezier(0.23, 1, 0.32, 1)` (or `0.16, 1, 0.3, 1`).
- Moving/morphing on screen: **ease-in-out** `cubic-bezier(0.77, 0, 0.175, 1)`.
- Sheets/drawers: `cubic-bezier(0.32, 0.72, 0, 1)`.
- Hover/color: `ease`. Constant motion (progress, marquee): `linear`. Hold-to-confirm fills: `linear`.
- **Never ease-in for UI** (it delays the moment the user is watching). No bounce/elastic as a reflex. Bounce is earned only at the end of a user-applied fling, or in a genuinely playful brand.
- Reuse the project's existing easing tokens. Don't invent parallel ones.

## 3. Duration
| Element | Duration |
|---|---|
| Press feedback | 100–160ms |
| Tooltip / small popover | 125–200ms |
| Dropdown / select | 150–250ms |
| State change, accordion | 180–250ms |
| Modal | 200–300ms |
| Drawer / sheet | 300–500ms |
| Authored marketing entrance | 500–800ms |

- Product UI stays ≤300ms except edge-attached sheets. Exits are faster than entrances (~60–75% of the enter time) and simpler (no reverse stagger).
- Asymmetric timing: slow while the user decides (a hold), fast when the system responds.

## 4. Physicality
- Never animate from `scale(0)`. Start at 0.95–0.97 with opacity 0.
- Press: `:active { transform: scale(0.97) }`, 100–160ms ease-out, on pressables.
- Popovers, dropdowns and tooltips scale from their trigger (`transform-origin` at the trigger). Modals stay centered.
- Small entrance distances: 6–16px rise (product), up to ~24px (marketing). Not 40–100px.
- Blur during crossfades: small (2–8px), never >20px (expensive in Safari).
- **Coherence:** a container and its content move as one object. Never scale or slide a background while its content stays put, and never animate a parent and its children in conflicting directions.
- Exit the way you entered (a toast from the bottom leaves through the bottom).
- Use transitions, not keyframes, for rapidly re-triggered elements, so they retarget from the current value instead of restarting.

## 5. Choreography (multiple elements)
- One entrance per container: don't animate a panel *and* stagger its children.
- No stagger on menus, tabs, list rows or anything keyboard-driven.
- Product UI stagger: 30–60ms between items, the group done in ≤300ms; stagger only the first ~6 items. Marketing: 80–150ms steps.
- Vary by role: the lead moves first and furthest, support follows with less, decoration only fades, static stays static. Uniform stagger reads mechanical.
- Choreography never blocks interaction, and every sequence survives interruption.
- At most **one authored entrance or scroll moment per page** on marketing surfaces. Fade-up-on-every-section is a tell.

## 6. Hover and touch
- Gate hover *motion* behind `@media (hover: hover) and (pointer: fine)`. Color hover states need no gate. `:active` feedback needs no gate.
- Hover feedback goes on the container (background, border, shadow shift), with one signal per element. Image zoom-on-hover and lift-on-every-card are opt-in for a stated reason, not defaults.
- Never hide essential information behind hover.

## 7. Gestures (drag, swipe, sheets)
- Track 1:1 with the pointer while dragging (no easing lag). Respect the grab offset. Use `setPointerCapture`. Don't set framework state per pointermove.
- Past bounds: rubber-band resistance (elastic ≈0.2), not a wall.
- Release: dismiss on distance (≈40–50% of travel) OR velocity (a flick ≈0.1–0.5 px/ms; pick one per product and document it). Settle with a spring seeded by the release velocity.
- ~10px movement before committing to a drag direction. Taps commit on pointer-up.
- Clean up on `pointercancel`, `lostpointercapture` and window blur. The next drag must work without reload.
- **Every gesture has a non-gesture alternative** (button, keyboard, Esc), per WCAG 2.5.7.
- For complex sheets/drawers, use a proven library already in the stack (or the platform's native element) rather than hand-rolling.

## 8. Springs (when the stack uses a spring library)
Critically damped (no bounce) by default, duration ~0.3–0.5s. Bounce 0.1–0.3 only after momentum or for playful brands. Springs keep velocity when interrupted, which suits gestures.

## 9. Performance
- Animate `transform` and `opacity` (plus `clip-path`, and `filter` carefully). Never animate width/height/top/left/margin/padding for motion. Use transform-scale or the FLIP / View Transitions technique instead.
- Never `transition: all`. List properties.
- `will-change` only as a last resort, only during the animation.
- Frame budget: 16.7ms at 60Hz, ~8ms at 120Hz. Loops pause offscreen (IntersectionObserver) and when the tab is hidden.
- Content is visible by default. A failed or blocked script must never leave content at opacity 0 (no-JS check).
- Implementation preference: CSS transitions/animations (incl. `@starting-style`, View Transitions, scroll-driven animations with fallbacks) → WAAPI → JS libraries (only for springs, shared layout, exits, gestures, timelines).
- Test on a mid-range phone, not only a fast laptop.

## 10. Reduced motion
`prefers-reduced-motion: reduce` means **fewer and gentler**, not broken:
- Remove movement, parallax, scaling, autoplay and loops. Collapse choreography to a single simultaneous fade.
- Keep opacity/color changes that carry meaning, and keep 1:1 drag tracking (the user creates that motion).
- Don't use a global `* { animation-duration: 0.01ms !important }` kill-switch that also kills meaningful feedback; prefer intentional reduced variants.
- Anything that moves automatically for >5s alongside content needs pause/stop (WCAG 2.2.2).
- Also consider `prefers-reduced-transparency` (solidify glass) and `prefers-contrast: more`.

## 11. Effect selection (expressive effects, backgrounds, text animation)
| Context | Allowed |
|---|---|
| Product UI / dashboards | Micro-feedback, number transitions, skeletons. No backgrounds, no text effects. |
| Docs / content | Essentially nothing beyond subtle fades. |
| Marketing landing | One subtle hero treatment (or none), one headline reveal *or* one scroll moment, hover feedback. |
| Portfolio / launch / campaign | Richer: galleries, WebGL hero, expressive type, with fallbacks. |

Avoid in almost all contexts: custom cursors and cursor trails, glitch/scramble text outside a genuine retro-tech/security brand, physics toys, multiple stacked shaders, looping effects on text people must read, and effects that hide content until scrolled. Every WebGL/canvas effect is lazy-initialized, pauses offscreen, caps device pixel ratio at 2, and has a static fallback image/color.

## 12. Motion review format
Report motion findings as a table: `| Element | Before | After | Why |`. Verdict: **Block** (feel-breaking, inaccessible, janky) or **Approve**, citing file:line. Fix order: delete → reduce → fix easing → fix origin → make interruptible → move to compositor properties → asymmetric timing → reduced-motion.
