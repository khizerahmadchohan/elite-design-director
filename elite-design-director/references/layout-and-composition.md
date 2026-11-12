# Layout and Composition
Contents: 1. Spatial thesis before editing · 2. Spacing system · 3. Grid and container · 4. Composition tools · 5. Page anatomy by visitor job · 6. Section composition rules · 7. Dashboard / app layout · 8. Elevation and depth  _(read only the section you need)_

## 1. Spatial thesis before editing
Before laying out a page or section, state:
- **Primary path:** what the eye hits first, second and third.
- **Groupings:** what belongs together (proximity first, containers last).
- **Lead vs support:** which element leads each section. Two leads means a hierarchy problem.
- **Density:** airy or dense, decided by use frequency and content volume.
- **Responsive intent:** what reflows, what stacks, what hides, what changes form.

## 2. Spacing system
- Use a 4-based scale: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160. Every value comes from the scale. No arbitrary `13px`.
- **Proximity rule:** gap inside a group < gap between groups < gap between sections. A common ratio is 1 : 2–3 : 4–8.
- Section spacing on marketing pages is typically 80–160px desktop and 48–96px mobile. Vary it by content weight; don't make it uniform.
- Use `gap` for sibling rhythm. Avoid margin soup.
- Typical component padding: controls 8–12 × 12–20; cards 20–32; panels 16–24; page gutters 16–24 mobile, 24–48 tablet, 48–96+ desktop.

## 3. Grid and container
- Use a 12-column grid on desktop (gutter 24–32px), 6–8 at tablet and 4 on mobile. Composition can break the grid on purpose, but alignment edges must be consistent.
- Cap the content container at ~1200–1440px (prose ~65–72ch). On 1920+ screens the gutters grow; the grids don't stretch. Full-bleed bands (photos, color fields) are allowed and carry contained content.
- Use `minmax(0, 1fr)` for grid tracks holding images or long text, and `min-width: 0` on flex children that contain text.
- Left and right page edges must match. Elements should sit on shared alignment lines; check this optically after rendering (icons and round shapes often need 1–2px optical correction).

## 4. Composition tools (use with intent)
- **Asymmetry:** 7/5, 8/4 or 5/7 splits with a dominant side. More dynamic than 6/6. Use when one element should lead.
- **Scale contrast:** one very large element (image, headline, number) against small, quiet supporting text.
- **Full-bleed vs contained alternation** creates rhythm.
- **Editorial devices:** running margins, pull quotes, captions with facts, sticky side columns, indexes. Use when the content is narrative or long.
- **Density shifts:** alternate a packed information section with an open breathing section.
- **Overlap / layering:** only with purpose (product rising out of a photo, a card crossing a section edge), and always check it at every breakpoint.
- **"Variation is not a goal."** Each layout choice should follow content. Ten different section layouts for the sake of variety is its own template.

## 5. Page anatomy by visitor job (replaces the default SaaS template)
| Job | Opening | Core | Close |
|---|---|---|---|
| **Book / visit** (local service) | Name + what + where + primary action + real photo; hours/today status | Services with prices, how it works, location/map, reviews (sourced), FAQ | Booking/call band with hours and address |
| **Buy** (product) | Product shown large, price, primary action | Benefits through use, details/specs, social proof, comparison, shipping/returns | Buy again + reassurance |
| **Request a quote** (B2B) | Specific offer + who it's for + proof | Case studies with outcomes, process, capabilities, credentials | Quote form with expectations (response time) |
| **Try / sign up** (SaaS) | One-line value + real product UI + action | Key workflows shown, integrations, security, pricing | Sign-up with plan reminder |
| **Hire** (portfolio/agency) | The best work, immediately | Selected work with context and results, approach, people | Contact |
| **Read** (content) | Title, summary, meta | Body with wayfinding (TOC, headings) | Related content, subscribe only if subscription is the business |

Guidance:
- Sections: 5–9 on a landing page is typical. Each has *one* idea.
- The **first viewport** must contain: what this is, for whom/where, the primary action, and a real visual. At 1280×800 the headline, supporting line and CTA should all be visible.
- The next section should peek above the fold, or the hero should clearly end. Avoid a dead band of empty space under the hero.
- **Whitespace calibration** ("too much whitespace" and "everything centered" are measured complaints):
  - Section gaps scale with content weight; a sparse section gets less padding, not more.
  - Keep no more than ~1/3 of sections center-aligned; left-aligned reading is the default.
  - Empty bands must hold intent (a pause before a key moment), not exist by default.
- Words: aim for roughly ≤80 visible words per screen on Persuade pages. This is guidance, not a law: pricing and docs need more.
- Close on a real ending (action + contact + reassurance), not an email signup unless subscribing is the job.

## 6. Section composition rules
- One focal element per section. Supporting elements are smaller and quieter.
- Don't repeat the same composition on consecutive sections (e.g., three image-left/text-right blocks in a row reads as template; vary or switch to a list/table).
- Cards are for **separate, equivalent, actionable objects**. If the items aren't equivalent, or nothing is clickable, consider a list, table or prose instead.
- Never nest cards. Inner radius = outer radius − padding (minimum ~4px).
- Primary actions: one per view. Secondary: at most one or two, visually subordinate. "Log in" is a text link.
- Navigation: ≤5–7 top-level items. More belong in a mega-menu or footer.

## 7. Dashboard / app layout (Operate)
- App shell: top bar for ≤6 destinations; a sidebar (≈220–280px, collapsible) when ~7+ destinations or deep hierarchy. Content area max width ~1440–1600px, never squeezed into a centered marketing column.
- Information hierarchy: page title + primary action → key status/summary (only metrics that drive a decision) → main working area (table, list, board) → secondary panels.
- Tables before cards for comparable records. One main chart ≥ 2/3 width when a chart is the point; secondary data as lists or tables.
- Stat tiles show the number, label, comparison context ("vs last 30 days") and period. No decorative sparklines unless the trend is decision-relevant.
- Every data region has four states: loading (skeleton matching layout), empty (what will appear plus how to start), error (what failed plus retry), full. Plus partial/permission states where relevant.
- Filters, tabs, sort and pagination state live in the URL.

## 8. Elevation and depth
Pick ONE strategy per system:
1. **Flat + hairlines + surface steps** (most product UIs, dark modes).
2. **Layered soft shadows** (ambient + key light, low opacity 0.04–0.12, offset Y > 0).
3. **Photographic depth** (images provide depth; at most one shadow tier).
Shadows need offset and soft blur. A zero-offset colored glow is decoration. Never put a hairline border + wide diffuse shadow on the same surface. The focus ring is an elevation level too.
