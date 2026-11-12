# Component Patterns
Contents: 1. Universal component contract · 2. Pattern rules · 3. Design-system showcase · 4. Stack notes  _(read only the section you need)_

Framework-agnostic rules first. Stack-specific notes are at the end and apply **only** when that stack is already in the project.

## 1. Universal component contract
Every interactive component defines:
- **States:** default, hover (pointer devices), focus-visible, active/pressed, disabled, loading, error, success where relevant, selected/checked where relevant.
- **Sizes:** usually sm / md / lg, with control heights ~32 / 40 / 48px (touch contexts ≥44px).
- **Variants by intent, not by color:** primary, secondary, ghost/tertiary, destructive, link. One primary per view.
- **Accessible name, role and keyboard behavior** following WAI-ARIA Authoring Practices (APG).
- **Content resilience:** long labels, empty values, large numbers, RTL, 200% zoom.

## 2. Pattern rules

**Buttons:** use `<button>` for actions and `<a>` for navigation, never a div. Labels are verb + object. Loading keeps the label and adds a spinner, and the button disables only once the request starts. Icons inside buttons are sized by the button, not ad hoc. Don't pre-disable submit buttons: let the user submit and show what's missing.

**Forms:**
- Visible label for every control; clicking the label focuses the control. Placeholders are examples, never labels.
- Group related fields; one column for most forms.
- Correct `type`, `inputmode` and `autocomplete`. Allow paste. Don't block typing; validate on blur or submit, not per keystroke.
- Errors inline next to the field, saying what's wrong and how to fix it. On submit, focus the first error, and use an error summary for long forms. `aria-invalid` and `aria-describedby` link the error text.
- Enter submits single-field forms; in a textarea, Cmd/Ctrl+Enter submits.
- Warn before discarding unsaved changes. Prevent double-submit. Trim input values.
- Required vs optional: mark the minority.

**Selection controls:** radio/segmented control for 2–5 visible options, select/combobox for more, a checkbox for independent toggles, and a switch only for an immediate setting change. Choice chips wrap before they shrink.

**Dialogs/modals:** only when the task needs interruption or focus protection. Prefer inline editing, popovers or side sheets. Must have a title, trap focus, close with Esc and a visible close button, and return focus to the trigger. Destructive confirmation names the object and consequence ("Delete 3 invoices?"). Buttons repeat the action ("Delete invoices"), never Yes/OK. Prefer undo over confirmation for reversible actions.

**Menus/dropdowns/popovers:** open from the trigger (transform-origin at the trigger). Arrow-key navigation, typeahead for long lists, Esc closes. Render in a portal or top layer so `overflow: hidden` doesn't clip them.

**Tooltips:** supplementary only, never essential info. Delay the first one ~500–800ms on hover, show peers instantly after that, and show immediately on keyboard focus. Not for touch-only information.

**Navigation:** current location indicated (`aria-current="page"`). Header ≤5–7 items. Mobile nav: a clear menu button with an accessible name; the opened menu traps focus or is a full-screen layer; bottom navigation for 3–5 primary app destinations. A skip link is the first focusable element.

**Tables:** for comparable records. Sticky header for long tables, right-aligned tabular numerals, sortable headers with `aria-sort`, row actions on hover *and* focus (and always reachable on touch). On narrow screens, collapse to stacked rows using cell labels, or allow horizontal scroll inside a labeled region with the first column frozen. Paginate or virtualize past ~50–100 rows. Never truncate numbers.

**Cards:** for equivalent, independent objects. If the whole card is clickable, use one link with an expanded hit area (pseudo-element), not nested interactive elements. Consistent image ratio across a row.

**Tabs:** only for peer views of the same object. Arrow keys move between tabs. The active tab is persisted in the URL when it matters.

**Toasts/notifications:** `aria-live="polite"` (assertive only for urgent errors), auto-dismiss ≥5s with pause on hover/focus, never the only place critical info appears, and an undo action where relevant. Exit the way they entered.

**Empty states:** what will appear here, why it matters, how to start (a primary action or template). Distinguish first use, no results (offer to clear filters), filtered-empty, no permission (how to get access) and error (retry).

**Loading:** skeletons that match the final layout for content regions. A spinner only for short, indeterminate actions, shown after ~150–300ms delay and kept visible ≥300–500ms to avoid flicker. Name what's loading. Never fake progress.

**Search:** visible input on content-heavy sites, debounce ~250–300ms, keyboard shortcut (Cmd/Ctrl+K, or `/` only when focus is not in a text field and with a visible hint; single-character shortcuts need a way to turn off per WCAG 2.1.4) in apps, results with highlighted matches, and a helpful no-results state.

**Pricing:** plans in a comparable structure, a highlighted recommendation only if it's genuinely recommended, monthly/annual toggle state clear, all costs visible, FAQ near the plans.

**Carousels:** avoid for primary content (low engagement, accessibility cost). If used: visible controls, swipe and keyboard support, no autoplay (or pausable autoplay that stops on interaction), and show part of the next slide.

## 3. Design-system showcase (when documenting)
Order: foundations → components → compositions. Show color role pairs with measured contrast. Show states side by side. Use real copy, including long, empty and error cases. Render Do/Don't as visual pairs. End with one realistic screen built only from tokens.

## 4. Stack notes (apply only when present)

**shadcn/ui (React + Tailwind):**
- Theme through CSS variables in `:root` / `.dark`. Pairs are `X` / `X-foreground` (background, card, popover, primary, secondary, muted, accent, destructive), plus border, input, ring, chart-1..5 and sidebar-*. Note: `accent` is the hover/active wash, not a brand accent. `muted-foreground` is secondary text.
- Mapping DESIGN.md roles: canvas → `--background`, ink → `--foreground`, soft band → `--muted`, secondary text → `--muted-foreground`, hairline → `--border`/`--input`, focus → `--ring`.
- Use `className` for layout, not for recoloring. Use semantic utilities (`bg-primary`), not palette classes. Don't add manual `dark:` overrides.
- Compose (`asChild` in Radix, `render` in Base UI). Dialog/Sheet/Drawer need a Title (sr-only if hidden). Forms use Field / FieldLabel / FieldDescription with `data-invalid` + `aria-invalid`.
- Pick the shadcn style preset closest to the target density and radius before customizing.
- Add components via the project's CLI; check `components.json` for the configured base (Radix, Base UI, React Aria) and icon library.

**Headless primitives in general** (Radix, Base UI, React Aria, Headless UI, Ark): prefer them over hand-rolled widgets for dialogs, menus, comboboxes, tabs and tooltips. They carry the APG keyboard model.

**Plain HTML/CSS:** use native elements first (`<dialog>`, `popover` attribute, `<details>`, `<select>`, `<input type=...>`). Style with custom properties.

**Elementor:** use native widgets (Button, Form, Nav Menu, Tabs, Accordion, Loop Grid, Popup) styled through Global Colors/Fonts and saved templates/components. See `wordpress-elementor.md`.

**Expressive effect libraries** (e.g., React Bits, which is MIT + Commons Clause; GSAP-based kits): may be *recommended* and installed into a user's own React project via their registry. Never copy their source into this skill or into redistributable kits. Use only effects that pass `motion-and-interactions.md` §Effect selection. One hero-grade effect per view, with a static fallback.
