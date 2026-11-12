# Last 10 Percent
Purpose: the finishing pass that separates "built" from "crafted". Run after the final quality gate, before handoff.

Contents: Optical · Type details · Consistency · Theming · Meta · States

## Optical
- [ ] Icons, play triangles and round shapes optically centered (nudge, not math-centered)
- [ ] Text in buttons visually centered (check cap-height, not line box)
- [ ] Hanging punctuation on pull quotes; opening quote sits outside the text edge
- [ ] Icon size relates to text (≈ cap-height to 1em) and sits on the baseline

## Type details
- [ ] No widows/orphans/one-word stragglers in headings (`text-wrap: balance`; `pretty` for prose)
- [ ] Tabular numerals in tables, prices, timers; oldstyle optional in long prose
- [ ] Real quotes and apostrophes (" " ' ' ’), real en/em dashes, × not x
- [ ] `&nbsp;` between number and unit (20&nbsp;min, 5&nbsp;kg, £&nbsp;where locale needs)
- [ ] Consistent sentence case across buttons, nav, headings
- [ ] Link `text-underline-offset` and thickness set deliberately

## Consistency
- [ ] Images in one row share ratio, radius and edge treatment
- [ ] Hover/press durations and easing identical across component families
- [ ] Container and content animate as one object

## Theming
- [ ] `::selection`, `caret-color`, `accent-color` and focus ring use brand tokens
- [ ] Scrollbar styled or left native on purpose; `scrollbar-gutter: stable` where layout shifts
- [ ] Form autofill (`:-webkit-autofill`) doesn't break colors in either theme

## Meta
- [ ] Favicon (SVG + fallback), page `<title>` per page, OG image and description
- [ ] Designed 404 with a route home and search/contact
- [ ] Print stylesheet for key pages (menus, invoices, docs) if relevant

## States
- [ ] Empty, loading, error and success states styled, not default
- [ ] Skeletons match final layout dimensions
