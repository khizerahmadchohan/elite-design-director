# Workflow: Single Section (inside an existing or planned site)

Examples: hero, features, about, services, pricing, testimonials, process, FAQ, contact, footer, product-page block. Success means two things at once: the section is **independently impressive** and **it looks like it was always part of this site**.

1. **Define the exact target.** "[section type] for [industry/subject] that must [job] for [audience]." Note the page, its position (what's before and after), and the platform.
2. **Absorb the site** (`references/site-consistency.md` §1).
   - Screenshot the page `--full` at 390 and 1440, and capture the neighbors with `--around`.
   - Extract or reuse the Site Language Sheet and the page's rhythm map.
   - Decide what this section must inherit and what it may vary (composition, background, density, signature).
3. **Research, Section tier** (`references/visual-research.md`).
   - Run 4–8 targeted queries for this section type in this industry, plus 1–2 out-of-category queries.
   - Gather 8–12 references from Dribbble (≥4), Pinterest (up to 4, adaptive: stop after 2 walled pages with no yield) and live sites.
   - Filter for quality, then deep-inspect 3–5.
   - Build a synthesis matrix and run the originality guard.
   - Save `design-research/<date>-<section>/REPORT.md` (or a chat summary if no files are wanted).
4. **Concept.** Write the 4-line Spec plus the decision ledger and run the same-prompt test (`design-generation.md` §2–4). Pick an archetype from §8 there (not the default card grid). In 2–4 sentences: the composition, the one signature device, how it uses the site's tokens, why it serves the job, and which reference ideas were adapted and how.
5. **Content.** Real copy and facts, specific headings, verb+object CTA; placeholders labeled. Write it per `copy-and-voice.md` (lexicon, headline method, section names in the brand's words); check it against `anti-ai-design.md` §Copy.
6. **Build** in the project's stack with the site's tokens and components (Elementor: native containers, widgets and Globals per `wordpress-elementor.md`). Responsive behavior designed per breakpoint.
7. **Verify in isolation:** standard widths, keyboard, states, contrast, reduced motion, slopscan.
8. **Verify in context.**
   - Use one run for everything: `shoot.mjs <page> --widths 390x844,768,1280x800,1440x900 --full --around "<section selector>"`. It writes viewport, full-page and in-context shots per width, plus a SUMMARY table that names any overflowing element.
   - Walk `checklists/consistency-audit.md` Level A (fit with neighbors) and Level B (the page still reads as one experience).
   - Compare against one other page of the site.
9. **Refine** whatever fails either level (often: heading scale mismatch, padding off-scale, foreign button style, clashing adjacent background, competing CTA, repeated composition), then re-capture.
10. **Final gate** (`checklists/final-quality-gate.md`) and handoff, including: research summary (references and what was adapted), consistency verdicts A and B, scorecard, hard gates, placeholders.
