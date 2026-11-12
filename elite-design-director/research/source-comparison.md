# Source Research and Comparison

Research date: 2026-11-12. All ten repositories were shallow-cloned into an isolated staging directory, read as untrusted data (no scripts executed), and analyzed file by file. Raw per-repo notes (~29k words) were synthesized into this skill. Version/commit = default branch HEAD on the research date.

## 1. Source summaries

| # | Repo | What it actually is (verified) | Distinctive strengths | Main weaknesses |
|---|---|---|---|---|
| 1 | **UI UX Pro Max** (nextlevelbuilder, MIT) | 7 skills; core is an offline BM25 search (stdlib Python) over CSVs: 192 product types, 192 palettes (16 roles), 74 font pairs, 120 UX rules, 25 chart rules, 89 styles, 22 stack guides; a design-system generator writing MASTER.md + page overrides | Solid WCAG-2.2-era UX/a11y rules with do/don't; chart selection with volume thresholds; semantic color roles with on-colors; abstain-instead-of-guess search; master+override persistence; design dials | Industry→style/palette mapping is stereotyped (blue-600 ×17, slate-50 ×32, "AI purple"); lexical top-1 picks; boilerplate font tags; `design` sub-skill needs paid Gemini/MuAPI/Atlas keys |
| 2 | **Taste Skill** (Leonxlnx, MIT) | Heavy site-building kit: dealt palettes/heroes/moments, ~15 Node scripts, headless-Chrome gate at 5 widths wired as a Stop hook, photo library, copy linter | Mechanical browser verification (tap size, collisions, scripts-off, reduced motion, anti-gaming); image honesty (stand-in ledger, detail-only stock); deepest copy-tell taxonomy incl. over-correction effects | Rigid house taste (mandatory hover zoom, scroll moments, exact section heights); "deal, don't choose" can outrank fitness; website-only; heavy dependencies |
| 3 | **Impeccable** (pbakaus, Apache-2.0) | One skill, ~25 commands (shape, critique, audit, polish, typeset, layout, animate, colorize, bolder, quieter, distill, harden, adapt, optimize, clarify, delight, onboard, overdrive, document, extract, init…), a Rust detector (~60 rules), context files (PRODUCT.md / DESIGN.md / surface brief) | Surface **modes** (Persuade/Operate/Read/Experience); craft-floor verify/refuse lists; "four AI looks" calibration; isolated judgment-vs-detector critique; calibrated Nielsen rubric + P0–P3; every command chains to polish; strong harden/i18n | ~40% of prose depends on its own binary; inconsistent thresholds across files (measure 45–75 vs 65–75); thin positive guidance; absolute eyebrow ban conflicts with "brief wins" |
| 4 | **Hallmark** (Nutlope, MIT) | Generation methodology with ~85 numbered gates in tiers (Floor / Reflex-with-waivers / Finish), `sloplint` + Playwright render pass 320–1920, dealt themes, fresh-context hero & finish reviewers, redesign preservation ledger, eval harness | Tiered gate model with evidence-backed waivers; fresh-context review; capture-real-product-over-mock; anatomy by visitor job; before/after link & form preservation; brand truth from fetched CSS | Enormous ceremony; several house rules stricter than the field (80-word cap, total eyebrow/em-dash/middle-dot bans); bans many good fonts; marketing-centric |
| 5 | **Emil Kowalski skills** (MIT) | 18 skills on motion & interaction: animate, review/improve/remove animations, choreograph, gestures, apple-design, animation-performance, mobile-native, break-ui, prototype, pick-ui-library… | Frequency gate; exact easing/duration tables; never ease-in; origin-aware popovers; choreography roles; gesture physics; performance tiers; reduced motion = gentler; Before/After/Why review format; worst-case data testing | React/Motion/Base UI assumptions; some internal threshold inconsistencies (flick velocity units) |
| 6 | **Unslop** (heydamir, CC-BY-4.0) | One redesign skill: audit vs sign list → 5-line direction → user approval → nine ordered passes; snapshot and story-video scripts | Best triage ("no slop → say so"); approval gate before edits; reasoned pass order; only real dashboard/app guidance (sidebar widths, chart hierarchy, stat cards); "quiet chrome, rich moments" model | No linter; thin a11y; recommends fonts others flag as overused; favors generated hero imagery |
| 7 | **Awesome DESIGN.md** (VoltAgent, MIT) | 84 brand-inspired DESIGN.md files in the Google Stitch format (YAML tokens + 8–11 prose sections) | Clear reusable schema; `{group.token}` references; Do/Don't + Iteration Guide + Known Gaps practices; cross-brand patterns (6–9 neutrals, base-4 spacing, display 3.5–5× body, scarce accent, one depth strategy) | Brand identities themselves must not be copied; motion usually missing |
| 8 | **shadcn/ui** (MIT) | React + Tailwind component system (Radix / Base UI / React Aria bases) with a skill, rules, theming docs and a DESIGN.md→shadcn mapping guide | Token pairs (X / X-foreground); composition over props; data-slot; built-in a11y (required dialog titles, aria-invalid); design-system-page method | React+Tailwind only |
| 9 | **React Bits** (DavidHDev, MIT + Commons Clause) | ~216 animated components (text, animations, components, micro, backgrounds) using raw WebGL, ogl, three.js, GSAP, motion | Broad catalogue; most respect reduced motion | Commons Clause forbids redistribution/porting; many effects gimmicky outside creative contexts |
| 10 | **Vercel Web Interface Guidelines** (MIT) | Single guideline list (README) + MUST/SHOULD form (AGENTS.md) + review command | Precise production rules: forms (Enter/⌘Enter, no pre-disable, idempotency), loading show-delay/min-visible, URL state, hit targets, i18n, hydration, perf budgets, copy | Some Vercel-brand rules (Title Case, "&"); README contradicts itself on `maximum-scale=1`; prefers APCA over WCAG 2 |

## 2. Capability inventory and comparison matrix (27 areas)

Legend: ● strong, ◐ partial, ○ absent. **Decision:** A = adopt, I = improve, C = combine, X = exclude.

| # | Capability | Pro Max | Taste | Impecc. | Hallmark | Emil | Unslop | D.md | shadcn | RBits | Vercel | Best source | Decision → in skill |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Design intelligence / decisions | ● (stereotyped) | ◐ | ● modes | ● anatomy | ○ | ◐ | ○ | ○ | ○ | ○ | Impeccable modes + Hallmark jobs; Pro Max functional must-haves | C, I: stereotype styles removed → design-intelligence.md |
| 2 | Creative direction / identity | ◐ | ● (dealt) | ● | ● (themes) | ○ | ● 5-line | ◐ | ○ | ○ | ○ | Impeccable new-work ideas + Unslop direction + Hallmark tone | C → creative-art-direction.md |
| 3 | Reference research | ◐ | ○ | ◐ | ● brand-truth | ○ | ◐ refs | ● | ○ | ○ | ○ | Hallmark brand-truth + D.md principles | C → design-intelligence.md §4 |
| 4 | Typography & pairing | ◐ (74 pairs, generic) | ● | ● | ● | ◐ | ● | ● | ◐ | ○ | ◐ | Impeccable/Hallmark rules + D.md scale patterns | C, I: font rules split by mode → typography-and-color.md |
| 5 | Color & palettes | ◐ (roles good, palettes stock) | ◐ dealt | ● strategies, OKLCH | ● postures | ○ | ● ramps | ● | ● pairs | ○ | ◐ | Impeccable/Hallmark strategies + Pro Max/shadcn roles | C → typography-and-color.md Part B |
| 6 | Spacing / grid / rhythm | ◐ density dial | ● | ● | ● | ○ | ● | ● | ◐ | ○ | ◐ | Unslop values + Hallmark container rules + D.md | C → layout-and-composition.md |
| 7 | Layout & composition | ◐ | ● | ● | ● | ○ | ● | ◐ | ○ | ○ | ◐ | Hallmark anatomy + Impeccable spatial thesis | C → layout-and-composition.md |
| 8 | Premium landing pages | ◐ patterns | ● | ● | ● | ○ | ● | ○ | ○ | ◐ | ○ | Hallmark + Impeccable Persuade | C → landing-page-design.md |
| 9 | SaaS / dashboards | ◐ | ○ | ◐ operate | ◐ appendix | ○ | ● | ○ | ● | ○ | ◐ | Unslop + Hallmark app rules + shadcn | C, filled gap → dashboard-design.md |
| 10 | E-commerce | ◐ | ○ | ○ | ◐ | ○ | ○ | ○ | ○ | ○ | ○ | (gap) | New content → design-intelligence.md §3 |
| 11 | Component systems | ◐ | ◐ fragments | ◐ extract | ○ | ◐ | ◐ | ● | ● | ◐ | ● | shadcn + Vercel forms | C → component-patterns.md |
| 12 | Responsive | ● | ● | ● adapt | ● | ◐ | ◐ | ● | ○ | ○ | ● | Pro Max + Impeccable adapt + Emil mobile-native | C → responsive-design.md |
| 13 | Mobile-first UX | ● | ◐ | ● | ◐ | ● | ○ | ◐ | ○ | ○ | ● | Emil mobile-native + Vercel | C |
| 14 | Micro-interactions | ◐ | ● (mandatory) | ● delight | ◐ | ● | ● | ○ | ◐ | ● | ● | Emil | A, I → motion-and-interactions.md |
| 15 | Animation & motion | ◐ GSAP presets | ● moments | ● | ◐ | ● | ● | ○ | ○ | ● | ● | Emil (+ Impeccable thesis, Vercel rules) | C |
| 16 | Accessibility | ● | ● (checks) | ● (scattered) | ● | ◐ | ◐ | ○ | ● | ◐ | ● | Pro Max + Vercel + WCAG 2.2 | C, I: consolidated → accessibility-and-ux.md |
| 17 | UX psychology / usability | ◐ | ○ | ● Nielsen, cog. load, personas | ◐ | ○ | ○ | ○ | ○ | ○ | ◐ | Impeccable critique | A → accessibility-and-ux.md §6 |
| 18 | Visual storytelling | ○ | ● | ● pacing | ● | ○ | ● moments | ○ | ○ | ○ | ○ | Taste + Impeccable | C → imagery §8 |
| 19 | Photography / image direction | ◐ Pexels | ● | ● | ● | ○ | ● (generated) | ◐ | ○ | ○ | ◐ | Taste honesty + Hallmark capture + Unslop recipe (with consent) | C, conflicts resolved → imagery-and-visual-storytelling.md |
| 20 | Iconography / illustration | ● icons.csv | ● brand icons | ◐ | ● | ○ | ● | ◐ | ◐ | ○ | ◐ | Unslop + Hallmark | C |
| 21 | Anti-AI originality | ○ (worsens it) | ● | ● detector | ● gates | ○ | ● signs | ○ | ○ | ○ | ○ | Impeccable + Hallmark + Taste copy + Unslop | C, I: "no unexamined defaults" → anti-ai-design.md |
| 22 | Visual critique & auditing | ◐ | ◐ | ● | ● reviewers | ● motion review | ● | ○ | ○ | ○ | ● review fmt | Impeccable rubric + Hallmark fresh-eyes | C, new 12-dim scorecard → visual-quality-audit.md |
| 23 | Refinement & polishing | ○ | ◐ | ● polish/modes | ● finish | ● | ● 9 passes | ○ | ○ | ○ | ○ | Unslop order + Impeccable polish triage | C → design-refinement.md |
| 24 | Frontend implementation | ● stacks | ● kit | ● | ● | ● | ◐ | ◐ | ● | ● | ● | Vercel + Emil + shadcn | C → frontend-design-quality.md |
| 25 | Performance | ◐ react rules | ● perf.mjs | ● optimize | ◐ | ● animation perf | ◐ | ○ | ○ | ◐ | ● | Impeccable optimize + Vercel + Emil | C |
| 26 | Browser verification | ◐ stack MCP | ● CDP gate | ◐ (own binary) | ● Playwright | ○ | ◐ snapshot | ○ | ○ | ○ | ○ | Taste/Hallmark approach | I: original dependency-free shoot.mjs |
| 27 | WordPress / Elementor | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | **none** | New original content → wordpress-elementor.md |

**Key gaps no source covered:** WordPress/Elementor (all 10 sources are React/HTML-centric), e-commerce specifics, Shopify, a unified scorecard with hard gates, and a consolidated WCAG checklist. These were written new.
