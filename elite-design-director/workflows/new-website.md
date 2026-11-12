# Workflow: New Website

Use for multi-page sites built from scratch. For a single landing page, use `landing-page-design.md`. On WordPress/Elementor, follow this workflow for the *design* and `elementor-implementation.md` for the *build*.

1. **Understand the brief.** Extract business model, primary conversion, pages, content available, platform, deadline. Run `checklists/design-preflight.md`.
2. **Understand the brand.** Collect logo, colors, fonts, existing materials, competitors. Classify: established / incomplete / none (`references/creative-art-direction.md` §1).
3. **Identify the audience.** Who arrives, from where (search, ads, referral), on which device, with which anxieties (`references/design-intelligence.md` §1–2).
4. **Research references at the Full tier** (`references/visual-research.md`).
   - Run targeted queries per key surface (homepage hero, services, pricing, about) plus out-of-category ones.
   - Gather 15–25 references across Dribbble, Pinterest and live sites; deep-inspect 5–8.
   - Build a synthesis matrix and run the originality guard; save the research report.
   - Delegate gathering to a research subagent where available.
5. **Explore directions** per `design-generation.md` (4-line Spec, ledger, same-prompt test, ≥3-axis divergence, cross-project history). Draft 2–3 committed directions (`creative-art-direction.md` §3). Present compactly with a recommendation. Ask once; if told to proceed, pick and state the pick.
6. **Select the strongest direction.** Record the Direction Brief.
7. **Establish the design system.** Tokens, type scale, spacing, radius, elevation, motion, breakpoints (`references/design-systems.md`). Write `DESIGN.md` (seed version; finalize after build). Verify all color pairs for contrast.
8. **Plan the page structure.** Sitemap + per-page section list + a **rhythm map** per page (`references/site-consistency.md` §3), so every page varies composition deliberately while sharing one language. Each section: id, one idea, content source, visual type, and which section holds the page's one signature moment (`references/layout-and-composition.md` §5). Copy outline with real facts; list missing content.
9. **Design the sections.** Hero/first viewport first. Render it at 390 and 1440 and judge it against the memory test and swap test before continuing.
10. **Implement the interface** in the project's stack (`references/frontend-design-quality.md`; Elementor: `references/wordpress-elementor.md`). Build global parts (header, footer, nav) as reusable templates.
11. **Check responsive layouts:** `scripts/shoot.mjs` at 320/390/768/1024/1280/1440/1920 + `checklists/responsive-audit.md`.
12. **Check consistency** across pages: `checklists/consistency-audit.md` Level B on every page, plus a side-by-side of full-page captures.
13. **Review accessibility and functionality:** `checklists/accessibility-audit.md`; test forms, links, nav, states.
14. **Perform design critique:** `workflows/design-critique.md` (fresh-eyes subagent for the hero and home page where available).
15. **Refine weaknesses:** apply P0/P1 fixes, then the most valuable P2s. Re-shoot.
16. **Final quality audit:** `checklists/final-quality-gate.md`. Finalize DESIGN.md from what was actually built. Handoff: direction, scorecard, hard gates, placeholders/stand-ins to replace, assumptions, untested items.
