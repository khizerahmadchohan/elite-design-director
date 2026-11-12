# Workflow: Logo Creation (and logo refresh)
Read `references/logo-design.md` (sections as needed) and `references/vector-engine.md` §4–6.

1. **Mode:** new logo · refresh/redesign (inspect the current mark, list its equity, keep what's recognisable) · critique only · kit/assets only (go to step 9 with the supplied master).
2. **Brief** (`logo-design.md` §1): ask ≤5 questions once, or state assumptions. Record the smallest use size, the archetype and the adjectives.
3. **Strategy** (§2): category clichés list, word map, ≥2 mark types (§3). Optional light research: logo references for principles only (`visual-research.md`, Light tier); never trace or imitate an existing mark.
4. **Concepts** (§4): 8–12 one-liners → score → the 3 most different. Check `history/log.jsonl` to avoid repeating your own recent marks.
5. **Build** (§5) black-first SVG masters `concept-a-v1.svg`… Describe the geometry in words, then code it.
6. **Test** (§6–7): `node scripts/svgcheck.mjs concepts/ --sizes 16,24,32,64,256 --out sheets`. Read the contact sheet; name the single worst failure per concept; fix; repeat 2–3 passes. Apply the optical corrections, the letter test, junction inspection and the readings test.
7. **Checkpoint:** concept sheet (greyscale + one colour hint; `vector-mockups.md` §2) with name, idea, fit, one risk, recommendation. **Stop for the user's choice.**
8. **Refine the chosen mark:** small-size companion if 16 px fails, reversed thinning, colour (1–2, HEX/RGB/CMYK/Pantone), lockups (horizontal/stacked/symbol/wordmark).
9. **Kit:** `node scripts/svgexport.mjs master.svg --out kit --variants --mono #HEX --png 32,512,1024 --web-icons [--favicon-source fav.svg]`, plus lockup files and guidelines (`logo-design.md` §8). Add a presentation board if wanted (`vector-mockups.md` §3–4).
10. **Audit:** `checklists/vector-quality-audit.md` (SVG + visual + logo sections). For a website, place the logo in the real header at 390/1440 (`shoot.mjs --around header`) and check the favicon in a tab.
11. **Handoff:** files (vector vs preview), rationale, test results, MANIFEST row, trademark-search recommendation, font-license note, and a history log line.
