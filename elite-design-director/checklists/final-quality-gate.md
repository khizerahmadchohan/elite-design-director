# Final Quality Gate (before declaring done)

## 1. Hard gates: every one must PASS (or the work is "not shippable")
Result values: **PASS**, **FAIL**, **PENDING-CLIENT**, **NOT CHECKED**.
- **PENDING-CLIENT** is for a missing real-world input that the client must supply and that is clearly marked and logged: form endpoint, phone number, photos, reviews, prices. The build itself is correct.
- **NOT CHECKED** says why it wasn't checked.
- **Verdicts:**
  - *Shippable:* every gate PASS.
  - *Ready pending content:* only PENDING-CLIENT items remain. List them.
  - *Not shippable:* any FAIL.
- **H5 for JS-dependent apps:** where content is client-rendered data, H5 means there's no blank screen without JS (a `<noscript>` message or server-rendered shell) and no failed-reveal (content stuck at opacity 0). Marketing content must still render without JS.
| # | Gate | Result | Evidence |
|---|---|---|---|
| H1 | AA contrast on all primary paths and states | | |
| H2 | Full keyboard operability + visible focus | | |
| H3 | No overflow/broken layout at 320–390px | | |
| H4 | Links, forms, integrations, scripts work; no console errors on load | | |
| H5 | Content visible without JS; nothing stuck hidden by animation | | |
| H6 | Zoom enabled; primary touch targets ≥44px (never <24px) | | |
| H7 | No fabricated facts, reviews, metrics or logos | | |
| H8 | Redesigns: preservation ledger fully verified | | |
| H9 | CMS remains natively editable by the owner | | |
| H10 | All assets licensed; stand-ins disclosed | | |

## 2. Scorecard
Score the 12 dimensions (`references/visual-quality-audit.md` §3) with one line of evidence each. Total /60.
- **Ship bar (Persuade/Experience):** no dimension below 3, originality and creative direction ≥4, all hard gates pass.
- **Ship bar (Operate/Read):** no dimension below 3, UX quality, accessibility and production readiness ≥4, all hard gates pass.
- **Content-limited work:** when originality or production readiness is capped only by missing real content (no photos, facts or proof), report "design ready, blocked by content". Name the dimension and the score it would likely reach with real assets. Don't inflate the score.
- Below the bar → one more refinement round on the weakest dimensions, then re-score. Report honestly if it still falls short and why (e.g., missing real photography).

## 3. Verification record
- Rendered widths captured: ___ (or "static review only").
- Keyboard/focus check method: ___
- Reduced-motion check method: ___
- Contrast check method: ___
- Real-device test: done / not done.
- Fresh-eyes review: subagent / single-context.

## 3b. Research and consistency record
- **Research tier** used (Full / Section / Light / None, and why). Platforms actually viewed, with counts (e.g., "Dribbble 7 viewed; Pinterest 5 via metadata/source pages, logged out; live sites 3"). Limitations.
- **Shortlist** (5–8 or 3–5) with URLs, and which ideas were adapted and how. Originality check passed: the result matches no single reference on more than one axis.
- **Consistency:** Level A (section in context) pass/fail · Level B (page and site) pass/fail. A failure on either level means one more refinement round. A design that is beautiful in isolation but foreign to its site is not done.

## 3c. Finish
- `checklists/last-10-percent.md` walked (Persuade/Experience).
- One accessory removed (the weakest decorative element).
- A line appended to `${CLAUDE_SKILL_DIR}/history/log.jsonl` (`design-generation.md` §6).

## 4. Handoff contents
Research summary · what was built/changed · scorecard + hard gates · DESIGN.md location (and Elementor global mapping) · placeholders and stand-ins to replace · assumptions made · what was not verified · recommended next steps · publish status.
