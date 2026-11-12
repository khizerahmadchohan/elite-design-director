# Test Results (Phase 10), 2026-11-12

Five isolated briefs. Each was run by a separate agent that loaded the installed skill from scratch and followed its routing. All builds lived in a scratch directory. **No real or client website was touched, and no MCP/CMS tools were called.** Rendered checks used `scripts/shoot.mjs` (headless Chrome via CDP). Keyboard and focus were assessed by code inspection only, because the script cannot press keys. No real-device tests were run, and contrast was computed, not measured on a device.

| # | Scenario | Evidence | Score before → after refine (/60) | Hard gates | Verdict |
|---|---|---|---|---|---|
| 1 | Premium business site (fictional Lisbon architecture studio, no brand, no photos) | Rendered at 390/768/1280/1440 + full pages, slopscan | 40 → 44 | All pass except the form endpoint (placeholder) | Design ready, blocked by content (no photos or facts). Originality 3 and production readiness 2 are capped by missing real assets. |
| 2 | Automotive landing (fictional fleet detailing, keep brand orange #E8590C) | Rendered + full pages, slopscan | 41 → 45 | H4 placeholder form and phone (now PENDING-CLIENT) | Ready pending content. Avoided the dark/red/glossy automotive rut; brand orange is used only as a fill with dark text (4.7:1), never as small text on white (3.58:1, measured by palette.mjs; an earlier note said 4.15). |
| 3 | SaaS dashboard (fictional truck-wash bookings screen with states) | Rendered at 4 widths + loading/empty/error/no-results/details states, slopscan 16 → 3 | 32 → 40 | H5 originally failed (JS-rendered table); the gate is now clarified for apps | Below the Operate ship bar (accessibility and production readiness are 3). Keyboard is verified by code only. |
| 4 | WordPress/Elementor (fictional home-care agency; Hello + Pro, WPForms + webhook, LiteSpeed) | Plan-only (static), contrast script for 16 pairs (all AA, body AAA) | ≈3.5/5 per dimension (plan level) | Unverifiable without a staging build | Strategy complete: globals mapping, container trees, forms preserved by ID, motion removal, cache and rollback plan. |
| 5 | Redesign of an AI-generated site (fictional bookkeeping service) | Before and after rendered, slopscan, ledger verified by parsing both HTML files | **17 → 46** (43 before the final refine) | Before: 5 fails (focus, overflow, hidden-without-JS, fabricated proof, contrast). After: all pass | Links 6/6, form 1/1, fields 5/5, tracking 3/3, prices 3/3, FAQ 5/5 verbatim. Fabricated proof replaced with labeled placeholders. |

## Weaknesses found and fixed in the skill
1. **Routing gaps:** SKILL.md rows didn't load the scorecard, gate and other supporting files their own workflows needed. Fixed: every row is expanded, and a rule now says every build ends with visual-quality-audit + final-quality-gate. A single-page homepage now routes to the landing workflow.
2. **Elementor accuracy:**
   - Custom Global variables use generated IDs, not role names.
   - Theme Style form fields only affect Elementor Forms (WPForms, CF7 and Gravity ignore them).
   - Kit and Theme Builder changes have no draft state, so a staging/backup/additive strategy was added.
   - A tested reduced-motion snippet was added (it handles `.elementor-invisible`), plus cache/regenerate-CSS steps and Sections→Containers conversion.
3. **Gate semantics:** PENDING-CLIENT status and the verdicts "ready pending content" / "blocked by content" were added. H5 was clarified for JS-dependent apps.
4. **Redesign contradiction:** fabricated existing content must not be carried forward as real. It is now an explicit exception to "removals require agreement".
5. **Refinement scope:** "no new colors or fonts" now applies only to polish and intensity modes, not to an approved restyle.
6. **shoot.mjs:**
   - Added WxH sizes (390x844, 1280x800) and `?query` support on file paths.
   - Added a `--no-js` mode, which previously didn't exist and hung when first tried.
   - Hidden-at-rest detection now walks ancestors. It went from 0 to 35 detections on a page where every section starts at opacity 0.
   - Small targets are now listed (with a mobile under-44px count), and off-screen skip links are no longer counted as overflow.
   - It now hints when overflow comes from a pseudo-element, lists fixed/sticky elements, warns about full-page capture limits, and has a CDP timeout.
7. **slopscan.mjs:**
   - New rules: opacity-0 reveals, ease-in, testimonial/logo-strip verification, and emoji in `div`/`p`.
   - Raw hex inside gradients is now caught, while `#fff`/`#000` are ignored.
   - `!important` inside reduced-motion blocks is ignored, and `outline:none` is downgraded when `:focus-visible` exists.
   - Paths are now shown relative to the scanned root.
8. **Imagery:** added guidance for designing placeholder image slots. The `/` shortcut rule was reconciled with WCAG 2.1.4.

## Known limitations (not fixed)
- No automated keyboard/tab walk or screen-reader testing without an installed browser-automation tool. Code inspection stays the fallback and must be labeled as such.
- slopscan is regex-based. It cannot see runtime-injected styles and produces false positives by design. Human judgment comes first.
- Self-scoring bias: the test builders scored their own work. The skill recommends a fresh-context subagent review for important work.
- The Elementor guidance has not been exercised against a live Elementor editor in these tests (deliberately, to avoid touching client sites). Check the first real use carefully on staging.

## Test 6: Visual Research + Site Consistency engine (added later the same day)
**Brief:** add a "before & after / our work" section to the Test 2 automotive page, working on a copy.

**Research, done for real:**
- 5 site-filtered searches (3 Dribbble, 2 Pinterest, including 2 out-of-category).
- One refgrab run on 10 URLs (~107s); 8 images viewed (5 Dribbble, 3 Pinterest).
- Pinterest showed a login wall on every page. It was not bypassed; metadata and preview images were used instead.
- Shortlist of 5. Ideas were adapted, not layouts, and the originality guard passed.

**Result:** a dark "unit record" band with paired before/after slots and an orange seam, which echoes the hero's visit sheet. It is placed between the process section and pricing.
- Consistency Level A failed at first: 768px overflow and 2 raw hex colors. It passed after one refine round. Level B passed.
- About 33 tool calls in total.

**Fixes applied from feedback:**
- refgrab: clean exit code, a stdout summary table, documented refs.json shape, and creators from rendered metadata only.
- shoot: viewport, `--full` and `--around` now come from one run, with a SUMMARY table that names offenders.
- visual-research:
  - an adaptive Pinterest budget that stops after 2 walled pages with no yield;
  - Dribbble tag and search pages count as discovery only;
  - a fallback to live sites when quality is low.

## v2 upgrade re-tests (2026-11-12)
The same briefs as Tests 1 and 2 were rebuilt with the upgraded skill (Light research tier to save cost), then scored by **independent fresh-eyes reviewer subagents** that saw only screenshots and the brief.

| Test | v1 self-score | v2 self-score | v2 **independent reviewer** | Final (min rule) | slopscan vibe | a11y (`shoot --a11y`) |
|---|---|---|---|---|---|---|
| 1 Premium studio | 44 | 45 | **38** | 38 | 0.5 | 0 contrast fails; clean tab walk |
| 2 Automotive | 45 | 45 | **38** | 38 | 0 | 0 contrast fails; 23 stops, focus visible on all |

**Reading the numbers:**
- v1 and v2 scores are not directly comparable. v1 was self-graded only. v2's independent reviewers scored 7 points below the builders' own scores, which confirms the self-inflation the upgrade was meant to stop. The min(self, reviewer) rule is now enforced.
- **What improved (per reviewers):**
  - Both pages passed the swap test.
  - Both had brand-specific signatures: an annotated Lisbon façade drawing, and vehicle-class drawings tied to per-class fleet pricing.
  - Copy was specific (trade lexicon, real typologies and permits).
  - Color was committed at region scale.
  - There were no fabricated facts.
- **The history log worked:** re-test 2 avoided the earlier run's font, hero archetype and signature. Re-test 1 rejected two choices that would repeat a prior project.
- **Same weakness in both:** a "mid-page slump". The hero is distinctive, but process, pricing, FAQ and about sections fell back to template patterns. Raw "PLACEHOLDER:" copy and walls of empty image slots dragged down production readiness and composition, especially on mobile.

**Fixes applied after the re-tests:**
- `design-generation.md` §8b: every section names its archetype; a default mid-page pattern list counts as tells; the signature must recur in ≥2 more sections; a per-section same-prompt test; designed placeholders (no raw strings; hide unanswered FAQs); mobile compression (swipe rows or accordions, intentional crops). SKILL.md step 6 and the anti-AI checklist updated.
- **The skill itself was producing defaults, now fixed:**
  - palette.mjs gave warm anchors a cream canvas; the default is now near-neutral, with `--neutral anchor` as a deliberate opt-in.
  - The type-library pairing table had industry labels, and a re-test copied the "Trades" pair verbatim; the labels were replaced by voice qualities, with a rule not to adopt a listed pair whole.
- **shoot.mjs `--a11y` false positives removed:**
  - Focus stops are now scrolled into view instantly (pages with smooth scrolling gave 13 false off-viewport flags; now 0).
  - Font load status uses the loaded FontFace, so no more false "fallback".
- Reviewer template now takes state evidence (focus screenshots + a11y summary), so interaction isn't scored blind.

**Honest status:** both re-test pages scored 38/60 with the independent reviewer, verdict "fix". The skill now detects and names these gaps reliably. Closing them still depends on real content (photos, answers to FAQs) and on applying the new §8b rules, which were added after these builds and are not yet re-measured.

## v3 re-test of the §8b mid-page rules (automotive brief)
- **Independent reviewer: 41/60, up from 38.** Self-score was 46, so the final under the min rule is 41.
- Originality went from 3 to 4, and accessibility from 3 to 4 (a clean tab walk, 0 contrast failures out of 106 text elements).
- **Mid-page:** the rate sheet and the per-vehicle count form are no longer templates. The 4-step process row and the FAQ accordion still read as stock.
- **Still open:** visible "to come" placeholders at the conversion point, the CTA position in the 1440 hero, and the vehicle strip cropped on mobile.
- **Script fixes from this run:**
  - `--a11y` focus screenshots were blank. They now scroll the element into view and capture within the viewport, and were verified to show the focus ring.
  - `--only` now prints a note that it writes no screenshots.
- The history log was cleared after testing.

## v3 Vector engine tests (2026-11-12, fictional "Kestrel Fleet Detailing")
All 8 tests ran. Every shipped SVG passed `svgcheck`: 0 FAIL, 0 rasters, no script, foreignObject or external refs.
1. **Logo:** 10 one-line concepts → 3 builds of different mark types (split-K lettermark, kestrel-head tile, abstract wing), each with 2 passes naming the worst failure.
   - The head read as a pawn or parrot: killed.
   - The wing was the category's speed-line cliché: killed.
   - The K with a 45° wipe gap was chosen and still reads at 16 px.
   - Kit via `svgexport`: variants, PNGs, favicon.ico 16/32/48, apple/192/512/maskable, manifest. Horizontal lockup uses constructed letterforms, so no font license is involved.
2. **Hero illustration (1200×800):** 3 passes. Fixed a thin van strip, clipped wheels, a background band and invisible foam.
3. **12 custom icons:** spec written first; `--set` flagged calendar-check as too heavy; after one fix the set was consistent.
4. **Trace:** the flat logo traced with holes kept and 0 rasters. A gradient image triggered the "poor" suitability warning.
5. **Light/dark:** CSS-variable themeable SVG plus baked -light/-dark files, both rendered.
6. **In context:** the sky showed as a floating pale box and was made transparent. At 390 the test page's sticky bar covers the art bottom (a page issue, noted).
7. **Elementor:** ELEMENTOR.md lists widget, field and per-breakpoint size per asset; -light/-dark files for sanitizers.

**Fixes from feedback:**
- svgcheck: the dark row now resolves currentColor to white; large renders no longer overlap rows; the 16 px anti-alias check is downgraded to info for line art with a higher threshold; `data-edd-allow="bleed"` added.
- trace.py: suitability sampling now uses NEAREST (it had over-counted colours).
- svgexport: new `--themes` bakes -light/-dark files; docs say to feed the colour master.

**Limitations:**
- No boolean/stroke-to-path operations without Inkscape.
- The tracer is tuned for flat art; vtracer is an optional upgrade.
- The near-miss angle audit is a manual check.
- Photographs can't be vectorised faithfully.
