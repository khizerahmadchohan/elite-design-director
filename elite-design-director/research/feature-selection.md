# Feature Selection, Deduplication and Conflict Resolution

Rules applied: same feature at different quality → keep the strongest; complementary knowledge → combine; missing → fill; conflicting → resolve with evidence; weak → improve or exclude; framework-specific → isolate.

## 1. Deduplication decisions (one implementation per capability)

| Capability | Competing implementations | Selected base | Merged-in knowledge | Dropped |
|---|---|---|---|---|
| Design critique | Impeccable critique, Hallmark reviewers, Unslop audit, Emil review, Vercel review cmd | Impeccable's isolated judgment-then-evidence method | Hallmark's fresh-context reviewer; Unslop's triage; Emil's Before/After/Why table; Vercel's terse file:line findings | Impeccable's binary/storage plumbing; Hallmark stamps/Picks ceremony |
| Scoring | Impeccable Nielsen /40 + audit /20; Hallmark 1–5 pre-emit axes | **New 12-dimension 0–5 scorecard + 10 hard gates** (user requirement) | Impeccable's calibration ("most work scores mid-range"), P0–P3 + support tie-break; Hallmark's "weakest axis + fix, never invented" | Multiple parallel scores |
| Anti-generic detection | Impeccable detector (~60 rules), Hallmark sloplint (~85 gates), Taste copy-lint, Unslop sign list | Combined tell catalogue in anti-ai-design.md, framed as "no unexamined defaults" | Impeccable's four AI looks; Hallmark's swap test and waivers-with-reasons; Taste's over-correction table; Unslop's "quiet chrome, rich moments" | Absolute bans; rule numbering; Stop-hook gate |
| Refinement | Impeccable polish + modes; Unslop nine passes; Hallmark finish | Unslop pass order inside Impeccable's polish triage | Impeccable bolder/quieter/distill/harden/typeset/colorize/animate/delight definitions | `overdrive`, `live`, `generate` tooling |
| Motion | Emil (18 skills), Impeccable animate, Unslop, Taste moments, Vercel | Emil's frequency gate + easing/duration tables | Impeccable motion thesis & removal test; Vercel's 5s autoplay rule and CSS-first preference; Unslop's one-entrance rule | Taste's mandatory moments/hover zoom |
| Typography | All except React Bits | Impeccable/Hallmark rule set | D.md scale observations; Unslop app-UI ranges; Pro Max UX rules | Pro Max pairing lookup as defaults; dealt pairings |
| Color | Impeccable strategies, Hallmark postures (same 4 categories), Pro Max/shadcn roles, Unslop ramps | Impeccable/Hallmark 4 strategies (identical concept: merged) | Pro Max/shadcn role pairs with on-colors; OKLCH ramps; Vercel's tinting and state-contrast rules | Pro Max per-industry hex palettes |
| Design-system doc | Impeccable `document`, D.md format, Pro Max MASTER.md | Stitch-style DESIGN.md (D.md + Impeccable agree) | Impeccable Named Rules + North Star; D.md Known Gaps & Iteration Guide; **added Motion section** (D.md's most common gap) | Separate sidecar JSON |
| Browser verification | Taste CDP scripts, Hallmark Playwright, Unslop snapshot, Pro Max stack MCP | **Original `shoot.mjs`** (CDP, zero deps, local Chrome/Edge) | Taste/Hallmark: multiple widths, lazy-load scroll, fonts wait, scripts-off/hidden checks, overflow detection | Playwright/MCP installation requirements |
| Redesign | Hallmark redesign, Unslop, Impeccable polish | Hallmark preservation ledger + Unslop approval gate | Impeccable "refinement preserves, redesign replaces" | — |

## 2. Conflict resolutions

| # | Conflict | Sources | Resolution and reason |
|---|---|---|---|
| 1 | Generated imagery | Taste bans; Hallmark consent-only; Unslop prefers | Consent-only, disclosed, never depicting real places/products; real photos/captures first. Honesty for real businesses; cost awareness. |
| 2 | Text over photos | Taste/Unslop compose calm space; Hallmark scrim | Compose for calm space first; scrim only if measured contrast fails; separate mobile crop. |
| 3 | Photo filters | Hallmark always; Taste never | Natural for the client's own product/place; treatments only for stand-ins/abstract imagery when the direction calls for it. |
| 4 | Captions | Taste bans; Hallmark fact captions | Fact captions allowed (they carry information); "sample image" captions not. |
| 5 | Hover zoom / lift | Taste mandates; Hallmark/Unslop ban | Not a default; container feedback; zoom only with a reason. |
| 6 | Scroll moments | Taste mandatory; others ≤1 | Optional, ≤1 authored moment per page. |
| 7 | Fonts (Inter, DM Sans, Fraunces…) | Unslop recommends; Hallmark/Taste ban | Split by mode: need a stated reason on Persuade/Experience; fine in Operate UI. |
| 8 | Display weights | Unslop/Taste 400–500 only; Hallmark extremes | Neither is universal: 2–3 weights far apart; light display is a style choice. |
| 9 | Eyebrow/kicker labels | Impeccable hard ban; Hallmark Floor ban; D.md brands use them | Tell, not ban: remove by default, allowed when informative and integrated (brief wins). |
| 10 | Em dashes | Hallmark bans; Taste warns over-correction | Allowed in moderation; flag cadence only. |
| 11 | Words per screen | Hallmark ~80 Floor | Guidance for Persuade pages, not a gate. |
| 12 | Section height | Taste exactly 1–2 screens | Content-driven heights; avoid dead bands (Hallmark mass rules). |
| 13 | Asking the user | Unslop stop; Hallmark one ask; Taste none | Greenfield: one ask round (or infer if told to proceed). Redesign: approval before large changes. |
| 14 | Contrast metric | Vercel APCA; others WCAG 2 | WCAG 2.2 AA is the requirement; APCA as an aid. |
| 15 | Zoom / maximum-scale | Vercel README offers it; its AGENTS.md bans it | Never disable zoom; 16px inputs. |
| 16 | Overscroll | Emil none everywhere; Vercel pointer:fine only | Vercel's scoped version by default; app shells may opt in. |
| 17 | Reduced motion | Vercel "or disable"; Emil gentler | Gentler, keeping meaningful opacity/color and 1:1 drag. |
| 18 | Implementation preference | Vercel CSS-first; Emil springs for gestures | CSS → WAAPI → JS; JS libs for springs, shared layout, exits, gestures. |
| 19 | Sidebar | Unslop default 240–280; Hallmark earned by ~7 destinations | Top bar ≤6 destinations; sidebar for ~7+ or deep hierarchy; keep an existing one. |
| 20 | Prose measure | Impeccable 45–75 vs 65–75 vs >80 | 45–75ch, with 60–72 ideal for long-form; flag >80. |
| 21 | Accent dosage | Hallmark <5%; Impeccable 10%; Committed 30–60% | Depends on strategy: Restrained ≈≤5–10%; Committed 30–60% fields. |
| 22 | Industry palettes | Pro Max maps industry → style/palette | Excluded as defaults; industry informs functions and anxieties only. |
| 23 | Velocity threshold units | Emil 0.11 px/ms vs 500 px/s | Range 0.1–0.5 px/ms; pick one per product and document it. |

## 3. Improvements beyond the sources
1. **WordPress/Elementor module:** V3 Globals and V4 variables/classes mapping, containers, Theme Builder, Loop Grid, editability as a hard gate, MCP-aware workflow, live-site safety. No source had any of this.
2. **E-commerce and Shopify guidance:** absent from all sources.
3. **Unified 12-dimension scorecard with per-score anchors + 10 explicit hard gates**, plus mode-specific ship bars.
4. **Consolidated WCAG 2.2 AA checklist**, previously scattered across five sources.
5. **"No unexamined defaults" framing** replaces conflicting hard bans with reason-required waivers, which resolves the brief-wins vs ban contradiction in Impeccable and Hallmark.
6. **Dependency-free tooling:** an original CDP screenshot/render checker and an original static scanner. No Playwright, no Python packages, no paid APIs, no background services.
7. **Mode-aware routing** in SKILL.md so small tasks load one file instead of the whole system (progressive disclosure).
8. **Honest verification records:** every gate and checklist distinguishes rendered, scripted, static and not-checked.
9. **DESIGN.md Motion section** added to the template (the most common Known Gap across the 84 D.md files).

## 4. Excluded (and why)
- Pro Max industry→style/palette defaults and hex palettes (stereotyped); its paid-API `design` generators (Gemini/MuAPI/Atlas) and Pexels scraping.
- Taste's mandatory house rules, dealt decisions, Stop-hook gate and asset kit (rigid, heavy).
- Hallmark stamps, Picks block, theme dealing and gate numbering (ceremony); Together-API comps (paid).
- Impeccable live/generate/hooks/storage tooling (binary-dependent).
- Unslop story-video script (ffmpeg + Playwright; out of scope).
- React Bits source code (Commons Clause); only usage guidance is kept.
- Emil's Swift/Expo specifics (out of scope for web), summarized only as "native platforms differ".
- Vercel brand-specific copy rules (Title Case, "&").

## 5. Addendum (2026-11-12): Visual Research + Site Consistency engines
The user requested permanent Pinterest and Dribbble research, multi-reference synthesis, website-wide consistency, controlled variation and two-level continuity checks. All of these were integrated (`references/visual-research.md`, `references/site-consistency.md`, `workflows/section-design.md`, `checklists/consistency-audit.md`, `scripts/refgrab.mjs`, `shoot.mjs --around`).

**Verified access (tested on the research date, not assumed):**
- Plain HTTP fetch returns empty pages for both Dribbble (HTTP 202, empty body) and Pinterest (an empty JS shell).
- Site-filtered web search returns real shot, pin, tag and idea URLs for both.
- In headless Chrome, Dribbble search, tag and shot pages render fully without login.
- In headless Chrome, Pinterest pages render behind a "Log in to see more" overlay. Public metadata (title, description, og:image) is available. Bypassing the wall is not permitted, so the skill uses metadata, the visible area, and the pin's original-source pages, or the user's own logged-in browser via the Chrome extension if connected.

**Adaptations made for performance, cost and quality** (requested: "change anything that would hurt performance"):
1. **Proportional tiers instead of always 15–25 references.** Full: 15–25 gathered, 5–8 deep. Section: 8–12 / 3–5. Light: 3–5. None for fixes, refactors and critiques. Running 20+ page renders on every small task would add minutes and heavy context with no quality gain.
2. **Research subagent delegation** for the Full and Section tiers, so dozens of screenshots don't flood the main context. The main thread views only the finalists.
3. **Reuse cache:** research reports are saved under `design-research/` and reused for the same surface.
4. **Stop rule:** stop gathering once the shortlist is strong. Volume is not the goal.
5. **Quality filter:** Dribbble and Pinterest are full of unbuildable concept art, templates and AI-slop trends. Popularity is explicitly not a signal, and references must pass relevance, buildability, accessibility, genericness and fit checks.
6. **Originality guard:** at most one major attribute per reference, a match on at most one axis with any reference, plus at least one idea from the brand's own world. This prevents synthesis from collapsing into a copy or into the platform's trend average.
7. **Live sites are added** as a third source, because concept shots can't show real proportions, responsiveness or interaction.
8. **Polite tooling:** sequential capture, a minimum 1.5s delay, a cap of 25 pages per run, no login or CAPTCHA bypass, and preview images kept for private analysis only.

## 6. v2 QA upgrade (2026-11-12)
**Why:** QA found the skill strong at "don't" but weak at "do", with self-graded scores (40–46/60) and no forced divergence. The research also found that "fixes become the new tells" (Anthropic cookbook vs. its newer skill; Reddit study).

**Selected:**
- A generative layer: `design-generation.md` (Spec, ledger, same-prompt test, divergence, history log, archetypes, image share), `type-library.md`, `copy-and-voice.md` and `palette.mjs`.
- A calibrated, mandatory fresh-eyes reviewer (`agents/design-reviewer.md`, final score = min(self, reviewer)).
- Data-weighted tells: bento, glass and mesh demoted to low-signal; the "tasteful default" added.
- Machine-verified a11y (`shoot --a11y`: tab walk, contrast, fonts, semantics).
- Elementor MCP quirks.
- A token-economy pass: SKILL.md −18% words despite new features, tiered core/on-demand routing, Contents lines in every reference, compact script output and an effort budget table.

**Not adopted:** fixed font or palette recommendations as defaults (they become tells), and reroll "dealing" mechanics. The history log achieves anti-convergence more cheaply.
