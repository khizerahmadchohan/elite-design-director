# Workflow: Design Refinement (polish and intensity modes)

Refinement preserves identity, behavior and copy. If the concept itself is wrong, say so and recommend a redesign instead of disguising one as polish. **Scope is sovereign:** touch only the named target. In polish and intensity modes, introduce no new colors, fonts, radii or primitives without asking. (A restyle or redesign that the user approved replaces the system by design; see `existing-website-redesign.md`.)

## 1. Triage (always first)
- **Heavy slop / weak:** run the full pass sequence (§2).
- **Light issues:** polish only: fix defects and tells, keep layout and system, and list bigger ideas as suggestions.
- **Already good:** say so. Offer 2–3 specific refinements with exact values, applied only on agreement.

Fix priority: (1) broken tasks, data loss, inaccessible paths → (2) missing states (loading/empty/error/success/disabled) → (3) hierarchy, flow, responsive and system drift → (4) visual and motion inconsistency → (5) code and asset cleanup. Don't perfect one corner while the rest stays below the bar.

For each drift, classify and fix at the narrowest correct level: a missing token (add the token), a one-off where a shared component exists (use the component), a conceptual mismatch (escalate), or a local defect (fix locally).

## 2. Pass sequence (for full refinement; strict order)
Each pass assumes the previous ones are done. Rhythm changes how everything else reads, so spacing comes first, and motion comes last because it must fit a screen that already works.
1. **Spacing:** snap to the scale, fix proximity groups, heading spacing, section rhythm, gutters.
2. **Color:** roles, contrast, accent scarcity, tinted neutrals, gray-on-color, state colors.
3. **Icons:** one family, size and stroke; remove decorative icon tiles and emoji.
4. **Copy:** specificity, verb+object CTAs, remove hype and tells, fix errors and empty-state text.
5. **Type:** faces, scale, weights, measure, tracking, wrapping, numerals.
6. **Layout:** hierarchy, focal points, composition variety by content, card/container necessity, alignment.
7. **Details:** radii (nested rule), borders vs shadows, focus rings, selection, states, browser surfaces.
8. **Visuals:** imagery quality, crops, text-on-image legibility, real product/place shown.
9. **Motion:** frequency gate, durations, easing, reduced motion; remove gratuitous motion.

After the passes: re-render, re-score, and compare with the before-scorecard.

## 3. Intensity modes (targeted)
- **bolder:** a flat section usually opts out of moves its neighbors already make. Raise it to the system's own peak with *one* decisive move (scale, a color field, an image, a structural break) and quiet everything around it. More effects is not bolder. Skeleton test after.
- **quieter:** reduce saturation (~70–85%), let neutrals dominate, step weights down one notch, shorten motion distances (8–16px), shrink scale jumps, realign rogue elements. Keep the point of view; generic gray quiet is a failure.
- **distill:** find the one primary goal. Cut to 1–2 brand colors + neutrals, one family with 3–4 sizes and 2–3 weights, one primary + one secondary action, no nested cards, inline editing over modals. Document what was removed. Never remove needed function or accessibility.
- **harden:** edge cases and resilience per `references/accessibility-and-ux.md` §8: long/empty/huge data, i18n expansion, RTL, errors mapped by status, offline, double-submit, interrupted gestures. Verification: click submit 10× fast, force errors, go offline.
- **typeset:** typography only, per `references/typography-and-color.md` Part A.
- **colorize:** color strategy and roles per Part B. Hue from the brand's world; commit at region scale; verify contrast.
- **animate:** a motion thesis (one focal moment + feedback + continuity) per `references/motion-and-interactions.md`. Removal test on everything.
- **adapt:** responsive rethink per `references/responsive-design.md`.
- **delight:** one-sentence delight thesis for a *rare* moment (success, first use, empty state). It must still feel good on the 100th view, never block the task, and never joke about money, privacy or loss.

## 4. Finish
Verify with mouse, keyboard and touch at mobile, mid and wide sizes; check the console for errors; review the final diff for churn; report Before | After | Why for the significant changes.
