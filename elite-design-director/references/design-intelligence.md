# Design Intelligence: Context Reasoning
Contents: 1. The reasoning chain · 2. Functional must-haves by vertical · 3. E-commerce specifics · 4. Reference research · 5. Design dials  _(read only the section you need)_

How to turn a business context into design decisions without falling into industry stereotypes. Industry tells you about **functional requirements, trust signals and user anxieties**. It must not dictate style or palette.

## 1. The reasoning chain

For every project, answer in order:
1. **Business model:** how does it make money? (lead-gen service, e-commerce, subscription SaaS, local walk-in, B2B quote, content/ads)
2. **Primary conversion:** the one action. Everything on the page is ranked by how much it helps or hinders it.
3. **Visitor anxieties:** what stops them? (price uncertainty, trust, effort, risk, time, "is this for me?")
4. **Proof that resolves each anxiety:** real reviews, certifications, photos of the real place, pricing transparency, guarantees, response time, portfolio.
5. **Context of use:** device (field workers on phones vs analysts on desktops), environment (light), frequency (daily tool vs one-time visit), urgency.
6. **Brand perception target:** 2–3 concrete adjectives *plus* their opposites to avoid.
7. **Then** visual direction (see `creative-art-direction.md`).

## 2. Functional must-haves by vertical (considerations, not styles)

| Vertical | Must address | Common anxiety | Avoid |
|---|---|---|---|
| **Local service** (car wash, plumber, clinic, salon) | Location + map, hours (incl. today), phone tap-to-call, services + price ranges, booking/quote, real photos of the place, reviews with source | "Are they open, near, reliable, how much?" | Stock photos of smiling people; hiding prices; contact only via form |
| **Automotive** (dealer, detailing, rental, parts) | Inventory/search with filters, real vehicle photos (multiple angles), price & finance clarity, test-drive/booking, location, comparisons/specs | Hidden fees, condition, trust | Glossy CGI cars that aren't stock; dark-with-red default; carousels hiding inventory |
| **B2B / professional services** | Clear offer, who it's for, case studies with outcomes, process, team credibility, quote/contact path | "Will this work for a company like mine?" | Vague claims, logo walls without permission |
| **SaaS marketing** | What it does in one line, product shown (real UI), who it's for, pricing, security/compliance, integrations, docs | Switching cost, data safety, price | Fake dashboards, gradient blobs instead of product |
| **SaaS app / dashboard** | Information hierarchy, navigation, tables, filters, empty/loading/error states, permissions, keyboard efficiency | Errors, data loss, slowness | Decorative charts, card soup, modals for everything |
| **E-commerce** | Product imagery (zoom, angles, scale), price, variants, stock, shipping cost/time, returns, reviews, fast cart/checkout, trust badges *that are real* | Fit/quality, total cost, returns | Hover-only info, carousel heroes, slow PDPs, surprise costs at checkout |
| **Healthcare / wellness** | Credentials, services, booking, insurance/pricing, accessibility (older users, larger text), privacy | Competence, cost, privacy | Clinical-cold or spa-cliché defaults; tiny text |
| **Finance / legal** | Credentials, regulation info, clear fees, calm hierarchy, high contrast, security cues | Risk, trustworthiness | Flashy motion, crypto-neon defaults |
| **Restaurant / hospitality** | Menu (HTML, not PDF), hours, location, reservation, photos of real dishes/space, dietary info | "Is it good, open, bookable?" | PDF menus, autoplay video with sound |
| **Real estate** | Search/filters, map, large galleries, floor plans, virtual tours, agent contact, price history | Hidden issues, price | Small photos, no map |
| **Education / courses** | Outcomes, curriculum, instructor credibility, schedule, price, enrollment flow, student work | Value, time commitment | Fake stats, stock graduation photos |
| **Portfolio / agency** | The work, large, with context and results; process; contact | "Can they do mine?" | Process theater with no work shown |
| **Non-profit** | Mission, impact evidence, donate path, transparency | Where money goes | Guilt-heavy stock imagery |

## 3. E-commerce specifics (WooCommerce / Shopify / custom)

- PDP hierarchy: image gallery → title → price (with any compare-at shown honestly) → variant selectors (visible swatches, not dropdowns for ≤8 options) → stock/shipping estimate → add-to-cart (sticky on mobile) → key benefits → details/specs → reviews.
- Collection pages: filter + sort always reachable (drawer on mobile), product cards with consistent image ratio, price, rating, quick variant indication. No hover-only add-to-cart on touch.
- Cart/checkout: show totals including shipping early, guest checkout, express pay, minimal fields, clear errors, persistent cart.
- Shopify: work within the theme's section/block architecture (Online Store 2.0, JSON templates, theme settings, `settings_schema.json`). Merchants must be able to edit sections in the theme editor. Use theme settings for colors and fonts rather than hardcoding.
- WooCommerce: respect the theme's templates and hooks; with Elementor Pro use the WooCommerce widgets and Theme Builder product templates (`wordpress-elementor.md`).

## 4. Reference research (when useful)

Do research when the category is unfamiliar, the user wants "premium", or you need proof patterns. Skip it for small fixes.
1. Find 3–6 references: 2–3 strong category players, plus 2–3 from *outside* the category with the target perception (for example, a premium truck wash might learn from aviation ground-crew signage or a high-end tool brand).
2. For each, extract: layout structure, type hierarchy, color strategy, how proof is shown, navigation pattern, section rhythm, image direction, interaction details.
3. Write **principles**, not copies: "Leads with a real photo of the facility at night; prices visible within the first two screens; one accent color used only on booking."
4. Note what the category does badly. That's your opportunity.
5. Never reuse a reference's brand assets, copy, illustrations or distinctive layout wholesale.

If web access is unavailable, rely on the principles here and state that no live research was done.

## 5. Design dials (optional shorthand)

Rate 1–10 to communicate intent quickly:
- **Density:** 1–3 airy (spacing 8/16/32/48/64/96/128), 4–7 standard (4/8/16/24/32/48/64), 8–10 dense (2/4/8/12/16/24/32).
- **Boldness:** how far type scale, color commitment and structure depart from the category norm.
- **Motion:** 1–3 feedback only; 4–6 plus one authored entrance or moment; 7–10 expressive (Experience mode only, with fallbacks).
