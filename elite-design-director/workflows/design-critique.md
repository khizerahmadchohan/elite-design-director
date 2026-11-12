# Workflow: Design Critique / Audit

A critique documents and prioritizes. It does not change code unless asked.

1. **Resolve the target.** A URL, a file path, screenshots, or a component. Prefer a stable source (file or staging URL). Note the surface mode (Persuade/Operate/Read/Experience) and the intended audience/job. Ask for them only if they can't be inferred.
2. **Capture evidence.** `scripts/shoot.mjs` at 390/768/1280/1440 (+320 and 1920 for full audits). If it can't be rendered, mark the review **static review only**.
3. **Assessment A, design judgment (first, uninfluenced).** Look at every screenshot. Write: overall impression, first focal point, what the page is "about" in one sentence, swap test, skeleton test, squint test, emotional journey (where confidence rises or drops).
   - For Persuade/Experience pages, full sites and redesigns, run this assessment in a **fresh subagent** using `agents/design-reviewer.md` (mandatory). Elsewhere it is optional.
4. **Assessment B, mechanical evidence (second).** `node ${CLAUDE_SKILL_DIR}/scripts/slopscan.mjs <path>` on source files; checklists: `anti-ai-design-audit.md`, `accessibility-audit.md`, `responsive-audit.md`. Code inspection for states, semantics, tokens.
5. **Synthesize.** Note where A and B agree, what the scan missed, and its false positives.
6. **Report in this order:**
   1. Header: target, mode, evidence type (rendered widths / static only), single- or multi-context review.
   2. Hard gates: pass/fail list.
   3. Scorecard: 12 dimensions 0–5 with one-line evidence each, total /60 (`references/visual-quality-audit.md` §3).
   4. Overall impression (3–4 sentences, direct).
   5. What works (2–3 specific strengths to preserve).
   6. Priority issues (3–7), each: P-level, location, what, why, fix with exact values, and the follow-up mode (polish / bolder / quieter / distill / harden / typeset / colorize / animate / redesign).
   7. Minor observations (brief).
   8. 2–4 targeted questions for the user, each tied to a finding with 2–3 concrete options. Skip if fewer than 3 priority issues.
7. **Tone:** direct and specific ("the hero CTA", not "some elements"); always say why; no softening, no "consider exploring".
8. **Next step:** offer to run `design-refinement.md` on the P0/P1 list.
