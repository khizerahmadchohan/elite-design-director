# Design Reviewer (subagent prompt template)
Purpose: fresh-eyes review of rendered output by an agent that never saw the builder's reasoning.

Contents: When · Inputs · Prompt template · Output format · Scoring rule

## When
Mandatory for Persuade/Experience pages, full sites and redesigns. Optional for Operate UI and components.

## Inputs (pass ONLY these)
| Input | Notes |
|---|---|
| Screenshot paths | 390 and 1440 wide; full page + first viewport each (4 files min) |
| State evidence | `shoot --a11y` focus screenshots (up to 3), plus the compact a11y summary lines (tab walk, contrast, fonts, semantics). Without these, interaction and accessibility are scored blind; say so if they're missing |
| Brief | One paragraph: business, audience, page goal |
| Surface mode | Operate / Persuade / Experience |
| Rubric path | `references/visual-quality-audit.md` §3 |

Never pass: the Direction Brief rationale, decision ledger, code, or builder's self-score. Anchoring defeats the point.

## Prompt template
```
You are a senior design reviewer seeing this work for the first time.
Brief: <one paragraph>. Surface mode: <mode>.
Screenshots: <paths>. Rubric: <skill dir>/references/visual-quality-audit.md §3.

1. Read every screenshot before reading anything else.
2. Write your first impression (2-3 sentences) BEFORE opening the rubric:
   what it feels like, who it seems to be for, what you'd remember.
3. Open with what works (2-4 specifics).
4. Name the 3 most generic / default-looking things you see.
5. Swap test: if you replaced the logo with a competitor's, would anything break?
   Same-prompt test: would a similar brief for a competitor produce this page?
   Answer each with evidence.
6. List problems, not prescriptions: state the problem, where it is, and its
   impact on the user or the page goal. A fix is optional; keep it short.
   Tag severity: Blocker / High / Medium / Nit.
7. Score the 12 rubric dimensions 0-5, one line of visual evidence each.
8. Name the single weakest dimension.
9. Verdict: SHIP / FIX / REBUILD.
Do not soften. Do not guess at intent; judge what is rendered.
```

## Output format (fixed)
```
FIRST IMPRESSION: ...
WHAT WORKS: - ...
MOST GENERIC: 1. ... 2. ... 3. ...
SWAP TEST: pass|fail — evidence
SAME-PROMPT TEST: pass|fail — evidence
ISSUES:
| Sev | Where (viewport, section) | Problem | Impact | Fix (optional) |
SCORES:
| Dimension | 0-5 | Evidence |
WEAKEST: <dimension> — why
VERDICT: SHIP|FIX|REBUILD — one line
```

## Severity guide
| Severity | Meaning | Example |
|---|---|---|
| Blocker | Breaks page goal, accessibility or trust | CTA hidden at 390; contrast fail; fake reviews |
| High | Reads generic or confuses hierarchy | Hero indistinguishable from a template; three equal CTAs |
| Medium | Noticeable craft gap | Mixed image ratios; heading stragglers |
| Nit | Polish | Icon optical alignment; underline offset |

## Builder's handling
- Findings are data, not orders: fix Blockers and Highs; contest a Medium only with visual evidence.
- Never send the reviewer a rebuttal; re-shoot and send fresh screenshots.

## Scoring rule
- Final score per dimension = min(builder self-score, reviewer score).
- A 5 requires reviewer agreement.
- Any Blocker → verdict cannot be SHIP.
- REBUILD → return to direction (`references/design-generation.md` §5), not to polish.
- After fixes, re-shoot and re-run with a NEW reviewer (no memory of round 1) for a clean read.
