# Accessibility Audit (WCAG 2.2 AA)

Mark each item **pass / fail / not checked (why)**. Never mark unverified items as pass.

**Visual**
- [ ] Text contrast ≥4.5:1 (large ≥3:1), including placeholders, text on images and all states.
- [ ] UI component boundaries, icons and focus indicators ≥3:1.
- [ ] No information by color alone (links in text, status, errors, charts).
- [ ] Reflow at 320px; 200% zoom usable; text-spacing override doesn't break layout.
- [ ] Zoom not disabled in the viewport meta.

**Keyboard and focus**
- [ ] Every interactive element reachable and operable by keyboard; no traps.
- [ ] Visible `:focus-visible` style on everything; not obscured by sticky elements.
- [ ] Tab order matches visual order; skip link present.
- [ ] Dialogs trap and return focus; Esc closes overlays; menus support arrow keys.

**Semantics**
- [ ] `lang` set; descriptive `<title>`; one h1; no skipped heading levels.
- [ ] Landmarks (header/nav/main/footer); lists and tables marked up properly.
- [ ] Buttons vs links used correctly; no clickable divs.
- [ ] Images: meaningful alt or empty alt for decorative; icon buttons have accessible names.

**Forms**
- [ ] Visible labels tied to inputs; required fields indicated; instructions before the form.
- [ ] Errors in text, next to the field, linked via `aria-describedby`; focus moves to the first error; summary for long forms.
- [ ] Correct `type`/`autocomplete`/`inputmode`; paste allowed; password managers work.

**Motion and media**
- [ ] `prefers-reduced-motion` handled (gentler, not broken); no auto-moving content >5s without pause.
- [ ] No flashing more than 3×/second.
- [ ] Video captions; no autoplay with sound.

**Touch**
- [ ] Targets ≥24px minimum, ≥44px for primary mobile actions; gesture actions have button alternatives.

**Dynamic**
- [ ] Status messages and toasts announced (`aria-live`/`role="status"`); loading states announced where relevant.
- [ ] Route/page changes move focus or announce the new context (SPAs).

Tools when available: axe/Lighthouse CLI in an existing project setup, a scripted browser tab walk, contrast computation script. Report the method used.
