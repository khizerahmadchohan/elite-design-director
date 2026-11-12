# Visual Research Engine (Pinterest + Dribbble + the wider web)
Contents: 1. When to research · 2. Define the exact target · 3. How to access the platforms · 4. Quality filter · 5. Deep inspection · 6. Synthesis · 7. Research report · Shortlist · Rejected · Synthesis matrix · Resulting concept: <2–4 sentences>, mapped to requirements · Originality check: <how the result differs from each finalist> · 8. Legal and ethical boundaries  _(read only the section you need)_

**Purpose:** before designing, see how strong professionals have solved *this exact* design problem, then synthesize an original concept. References inform decisions; they never become the design.

## 1. When to research (proportional by default)

| Task | Research tier | Gather | Deep-inspect | Platforms |
|---|---|---|---|---|
| Full website, full page, landing page, full redesign, new design system | **Full** | 15–25 | 5–8 | Dribbble ≥5, Pinterest ≥5 (when accessible), plus 2–5 live sites |
| Single section (hero, pricing, features, about, testimonials, contact, footer, product page block) | **Section** | 8–12 | 3–5 | Dribbble ≥4 opened shots, Pinterest up to 4 (adaptive, see §3), live sites to fill gaps |
| Dashboard / app screen | **Section** for new screens | 8–12 | 3–5 | Dribbble (strong for app UI), live products; Pinterest optional |
| Single component, visual tweak | **Light** | 3–5 | 1–2 | Dribbble or live examples |
| Bug fix, accessibility fix, code refactor, copy edit, critique of existing work, small polish | **None** unless asked | — | — | — |

Overrides from the user always win: "skip research" means none; "deep research" means the Full tier for any task.

**Reuse before re-searching.** Check the project's `design-research/` folder first. If a recent report covers the same surface, reuse it and research only the gap. Stop gathering once you have enough strong, relevant references. Volume is not the goal.

**Budget caps** (stop earlier if the shortlist is strong):
- Light: ≤5 tool calls.
- Section: ≤15 tool calls, ≤1 refgrab run (≤12 URLs), ≤3 minutes of browsing.
- Full: ≤30 tool calls, ≤2 refgrab runs, delegated to a research subagent.

## 2. Define the exact target (before searching)
Write one line: **[surface type] for [industry/subject] that must [job], for [audience], in [brand posture].**
Example: "Pricing section for a mobile fleet-detailing service that must drive fleet quote requests, for B2B fleet managers, in a utilitarian work-order posture."

Build 4–8 queries from it. Make them specific to the requested surface, not generic website inspiration:
- **Exact:** `car detailing pricing section`, `detailing packages pricing web`
- **Surface + adjacent industry:** `service pricing table website`, `fleet service quote page`
- **Surface + target posture:** `utilitarian pricing table ui`, `industrial web design pricing`
- **Out-of-category for originality (1–2 queries):** a different industry with the desired perception, e.g. `aviation maintenance website`, `tool brand product page`
- Dribbble tag pages are also useful: `dribbble.com/tags/<keyword>`.

## 3. How to access the platforms (verified methods, honest limits)

**Discovery: site-filtered web search** (fast, cheap, works for both platforms). Run WebSearch with `allowed_domains: ["dribbble.com"]`, then `["pinterest.com"]`, one query each. It returns real shot, pin, tag and idea URLs with titles.

**Rendering and inspection:** `node ${CLAUDE_SKILL_DIR}/scripts/refgrab.mjs <researchDir> <url> [url…] [--tall] [--images]`
- Renders each page in headless Chrome (sequential, ≥1.5–2.5s apart, at most 10–25 per run). It saves a screenshot and records title, creator (where shown), og:image, description, outbound "original source" links, and on listing pages up to 30 item links.
- `--images` saves the page's public preview image (og:image) so you can look at the design itself. These files are for private analysis only; never publish them or reuse them as assets.
- Plain HTTP fetch tools return empty pages for both sites (JS-rendered). Use refgrab or a real browser.

**Adaptive platform budget:**
- Treat the per-platform minimums as targets while the platform is yielding. If Pinterest returns a login wall on the first 2 pages and their metadata or source pages add nothing useful, stop spending Pinterest budget. Record "Pinterest: walled, n attempts" and move the remaining budget to Dribbble shots and live sites.
- Prefer single pin URLs (from site-filtered search) over boards and idea pages, which rarely expose source links when logged out.
- Dribbble search and tag pages are *discovery* (often padded with promoted shots), not references. Count only individual shots you opened.
- If overall reference quality is low (templates, flyers, concept art), fall back to 2–4 strong live sites from the category or from outside it.

**Creators and facts:** take creator names, titles and source links **only from what refgrab captured from the rendered page** (`author`, `title`, `outbound`), never from search-result snippets, which can be wrong. If the page shows no creator, write "creator not shown".

**Dribbble:** search, tag and shot pages render fully without login. Good for UI composition, components, typography treatment, cards and dashboards. Open individual shots (not just the grid) for the deep-inspect set.

**Pinterest:** pages render, but a login wall overlays them for logged-out visitors. refgrab reports `login-wall`. Allowed: use the public metadata it returns (title, description, preview image, outbound source link) and the visible part of the screenshot. Better: follow the pin's **original source** and inspect that page, since the source site is the real reference. **Not allowed:** logging in with invented credentials, dismissing or hiding the wall with scripts or CSS, or scraping behind it. If the user has the Claude-in-Chrome extension connected and is logged into their own Pinterest account, you may browse through *their* session (load the chrome-browser skill first). Otherwise record "Pinterest: partial (logged-out)" in the report.

**Also valuable:** live websites from the category and from outside it (best for real proportions, responsiveness and interaction), Awwwards/Godly/Land-book/Mobbin/Behance via the same search + refgrab approach, and DESIGN.md-style breakdowns. Live sites beat concept shots for anything functional.

**If a platform is unreachable** (bot challenge, error, nothing relevant): record it, don't retry in loops, and continue with the other sources. **Never claim you viewed something you didn't.**

**Context hygiene:** for Full-tier research, delegate gathering to a research subagent where available. It runs searches and refgrab, views the images, and returns the shortlist with notes and file paths. The main thread then views only the 5–8 finalists. This keeps dozens of screenshots out of the main context.

## 4. Quality filter (reject before you admire)
Dribbble and Pinterest are full of concept art, templates and generated-looking work. For each candidate, check:
| Check | Reject if |
|---|---|
| **Relevance** | Wrong surface type, wrong industry logic, print flyer for a web task |
| **Buildability** | Impossible layouts, fake 3D, text too small to ship, 8px gray-on-gray |
| **Realism** | No real content structure (lorem ipsum everywhere), fake dashboards |
| **Accessibility** | Contrast or targets that would fail AA as drawn (you may still borrow the idea and fix it) |
| **Genericness** | Matches the tells in `anti-ai-design.md` (purple gradients, glow, bento-by-default, the SaaS template) |
| **Fit** | Contradicts the brand, audience or job |
| **Freshness** | Visibly dated trend with no reason to revive it |

Popularity (likes, views) is not a quality signal. A shot can be popular and unshippable.

## 5. Deep inspection (the 5–8 finalists)
For each finalist, record: what the composition does (grid, proportions, focal point, flow), typography (faces or classification, scale contrast, case, tracking), color (strategy, dosage, how the accent is used), spacing rhythm, image treatment, component styling, interaction cues, **the one thing it does best**, and what *not* to take from it.

## 6. Synthesis (the most important step)
1. Build a **synthesis matrix:** rows = design attributes (composition, type, color strategy, imagery, component style, density, interaction, signature device); columns = finalists. Mark the strongest source for each attribute.
2. Select only attributes that serve the brief and the site's existing identity. You don't need to use every reference.
3. Translate each selected attribute into **the site's own tokens and voice** (its fonts, colors, radius, spacing). Borrow the *principle*, not the pixels.
4. Combine into one concept and add at least one project-specific idea that came from no reference (usually from the brand's world, per `creative-art-direction.md`).
5. **Originality guard:**
   - No single reference may contribute more than one major attribute.
   - Compare the result against each finalist on layout skeleton, palette, type pairing and signature device. It may match a single reference on at most one of these.
   - Never reproduce proprietary illustrations, photos, logos, copy or code from a reference.
   - If someone could say "that's a copy of X", rework it.
6. **Brand and requirements beat references.** If an attractive idea conflicts with the brand, accessibility or function, drop it.

## 7. Research report (Full and Section tiers)
Save to `design-research/<YYYY-MM-DD>-<surface>/REPORT.md` in the project, with screenshots in the same folder. If the user doesn't want files in the repo, use the scratchpad and put a summary in chat. Template:
```markdown
# Research: <surface> for <project>  (<date>, tier: Section)
Target: <one-line definition>
Queries: <list>   Platforms: Dribbble ✓ (n viewed) · Pinterest partial/logged-out (n) · Live sites (n)
Limitations: <what was blocked, missing or unviewed>

## Shortlist
| # | Reference | Platform | URL | Creator | Strongest quality | Taken (adapted how) | Not taken |
|---|---|---|---|---|---|---|---|

## Rejected (sample, with reason)
## Synthesis matrix
## Resulting concept: <2–4 sentences>, mapped to requirements
## Originality check: <how the result differs from each finalist>
```
Record only what you actually saw: real URLs, real creator names as displayed, real observations. No invented ratings or references.

## 8. Legal and ethical boundaries
References are inspiration under each platform's terms. Don't download in bulk, don't redistribute images, don't publish screenshots of others' work, and don't reproduce artwork, photography, illustrations, logos or code. Credit creators in the internal report. Respect robots, rate limits, login walls and CAPTCHAs, and never bypass them.
