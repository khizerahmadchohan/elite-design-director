# Visual Quality Audit
Contents: 1. Principles · 2. Browser verification · 3. Scorecard · 4. Hard gates · 5. Severity for findings · 6. Heuristic critique add-on  _(read only the section you need)_

## 1. Principles
- **Judge by looking.** Rendered screenshots at real widths beat code reading. If rendering wasn't possible, label the review **"static review only"**.
- **Judgment before tools:** write your own visual impression *before* reading `slopscan` output, so the scanner doesn't anchor you.
- **Fresh eyes:** for important work (a Persuade-mode hero, a full redesign), have a *separate subagent* review the screenshots with only the brief and this rubric, not your build reasoning. Builders reliably overrate their own output. If no subagent tool exists, say "single-context review".
- **Batch:** capture everything, fix everything one look reveals, then re-capture. Don't screenshot after every tweak. **At most 2 refinement rounds** unless a hard gate still fails; stop when changes stop being material. Re-Read the screenshots after each round, and include one before/after pair in the handoff.

## 2. Browser verification
`node ${CLAUDE_SKILL_DIR}/scripts/shoot.mjs <url-or-file[?query]> [outDir] [--widths 390x844,768,1280x800,1440x900] [--full] [--no-js] [--reduced-motion] [--dark]` uses the locally installed Chrome/Edge in headless mode (no npm install) and writes PNGs per size, plus a JSON report: horizontal overflow (with offending elements), elements hidden at rest, undersized targets (listed; `under44OnMobile` count), images missing alt/size, broken images, console errors, failed requests, fixed/sticky elements, and zoom blocking. Use `--no-js` to verify content renders without scripts (hard gate H5), `--reduced-motion` to verify reduced-motion variants, and the 1280x800 size for the "CTA above the fold" check. The script cannot press keys; do tab-order and focus checks by code inspection (and say so) or with a scripted browser already installed in the project. Then **open and look at each PNG** with the Read tool.

For a local project: start its dev server (or a static server) and pass `http://localhost:PORT`. For a single HTML file you can pass the file path. For a WordPress/Elementor site, use a preview/staging URL. Never hammer a production site.

If Playwright or a browser MCP is already installed in the project, it may be used for richer checks (keyboard tab walks, reduced-motion emulation, computed contrast). Don't install new tooling without asking.

What to check in screenshots: hierarchy and focal point, alignment edges, spacing rhythm, text wrapping/stragglers, overflow, image crops and text-on-image legibility, CTA visibility in the first viewport, sticky element overlaps, consistent component styling, empty dead bands, and whether it looks like *this* brand (swap test).

What screenshots can't show (check in code or a scripted browser): focus visibility, tab order, hover/active states, reduced motion, screen-reader names, form errors. Report which of these were checked and how.

## 3. Scorecard (0–5 per dimension)
General meaning of scores: **0** absent/broken · **1** poor, clear defects · **2** below standard, generic or inconsistent · **3** competent, professional, no major issues · **4** strong, intentional, few minor issues · **5** exceptional, distinctive, and flawless at this level. Most real work lands at 2–4. A 5 must be defended with specifics.

| # | Dimension | 1 looks like | 3 looks like | 5 looks like |
|---|---|---|---|---|
| 1 | **Visual originality** | Template/AI-default look, or a near-copy of one reference; fails swap test | Some specific choices; a few defaults remain | Unmistakably this brand; synthesized from several references without resembling any; passes swap & skeleton tests |
| 2 | **Creative direction** | No discernible direction | Coherent but safe direction | Clear North Star expressed consistently in type, color, image, layout, motion |
| 3 | **Typography** | Default faces, flat hierarchy, bad measure | Good scale, readable, consistent | Characterful faces chosen for reasons; refined spacing, breaks, numerals |
| 4 | **Color harmony** | Random or default palette; contrast fails | Coherent roles, passes contrast | Strategy committed at region scale; tuned ramps; meaningful accent use |
| 5 | **Layout composition** | Repetitive stacked sections; misalignment | Clean grid, sensible rhythm | Purposeful structure per content; strong focal points; varied, controlled rhythm |
| 6 | **UX quality** | Unclear primary action; confusing flow | Clear path; standard patterns | Effortless task completion; anxieties answered at the right moment |
| 7 | **Responsiveness** | Breaks/overflows on mobile | Works at all widths | Each breakpoint deliberately designed; mobile feels native |
| 8 | **Accessibility** | Fails contrast/keyboard/labels | Meets AA on main paths | AA everywhere incl. states; excellent focus, semantics, reduced motion |
| 9 | **Brand & site consistency** | Off-brand; section looks transplanted from another site | Consistent tokens and components; fits its neighbors | Feels designed with the whole site from day one; varied but harmonious rhythm (Levels A+B pass) |
| 10 | **Interaction quality** | Missing states; janky or gratuitous motion | All states exist; motion appropriate | Crisp feedback, purposeful motion, interruptible, reduced-motion variants |
| 11 | **Maintainability** | Hardcoded values; copy-paste; uneditable CMS | Tokens mostly used; reasonable structure | Fully tokenized; reusable components/templates; owner-editable; documented |
| 12 | **Production readiness** | Broken links/forms, console errors, CLS | Works; minor perf issues | Fast (CWV green), resilient states, SEO/meta complete, clean code |

**Calibration anchors** (observable; use these instead of adjectives):
- **Originality 4:** passes the swap test *and* the same-prompt test (`design-generation.md` §4); has a signature traceable to a brand fact; slopscan cluster < 3. **Originality 5:** all of that, plus the reviewer independently names the signature.
- **Typography 4:** faces chosen with a written reason; scale steps ≥1.25 (marketing); no stragglers at the 4 standard widths; tabular numerals where numbers compare.
- **Color 4:** strategy named; anchor sourced; every pair passes in `palette.mjs`/`shoot --a11y`; accent dosage matches the strategy.
- **Layout 4:** rhythm map shows no repeated composition+background; one focal point per section; image share ~30–50% on Persuade pages.
- **Accessibility 4:** `shoot --a11y` shows a clean tab walk, no contrast failures and labels present. 5 also needs a reduced-motion check and screen-reader names reviewed.
- **A 5 in any dimension requires reviewer agreement.** The final score per dimension is **min(self, reviewer)**.
- **Judgment first, provably:** write the "first impression" paragraph into the report *before* pasting any scanner output.

**Fresh-eyes review is mandatory** for Persuade/Experience pages, full sites and redesigns. Use the template in `agents/design-reviewer.md` (one subagent; screenshots + brief only). It is optional for Operate screens and components.

Report: the table with score + one-line evidence per row, total /60, and the **weakest dimension with its fix**. Don't invent a weakness to fill the field, and don't round up.

## 4. Hard gates (pass/fail, reported separately, never averaged)
A design is **not shippable** if any of these fail, whatever the score:
1. Text/UI contrast below WCAG AA on any primary path.
2. Any interactive element unreachable or unusable by keyboard, or no visible focus.
3. Horizontal scroll or broken layout at 320–390px.
4. Broken functionality: dead links, forms not submitting, lost integrations, JS errors on load.
5. Content hidden without JS or stuck at opacity 0.
6. Zoom disabled; any target under 24×24px; or primary mobile actions under 44×44px.
7. Fabricated facts presented as real (testimonials, metrics, logos, awards).
8. On redesigns: lost content, links, form fields or tracking that existed before.
9. CMS (Elementor/Shopify) changes that the owner can no longer edit natively, without agreement.
10. Unlicensed assets.

## 5. Severity for findings
- **P0:** blocks a task or is a hard-gate failure. Fix now.
- **P1:** major difficulty or an AA violation. Fix before release. (Tie-break: would a user contact support? Then it's at least P1.)
- **P2:** noticeable issue with a workaround. Fix in this pass if cheap.
- **P3:** polish.
Each finding: location, what, why it matters, the fix (exact values), and severity.

## 6. Heuristic critique add-on (UX depth)
For UX-heavy reviews, also score Nielsen's 10 heuristics 0–4 (total /40; most real interfaces land at 20–32), run the cognitive-load checks and 2–3 personas from `accessibility-and-ux.md` §6.
