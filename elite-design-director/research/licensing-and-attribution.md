# Licensing and Attribution

**This skill contains original writing.** It synthesizes methods and publicly stated design principles from the sources below, paraphrased and reorganized. No source files, component code or substantial verbatim passages were copied. Numeric values (durations, contrast ratios, cubic-bezier curves, size thresholds) are facts or widely used conventions, cited for transparency. The two scripts in `scripts/` are original implementations.

Licenses were checked in each repository's LICENSE file on 2026-11-12.

| Source | License | Obligations | How it was used |
|---|---|---|---|
| nextlevelbuilder/ui-ux-pro-max-skill | MIT (© 2024 Next Level Builder) | Keep the copyright notice if substantial portions are copied | Ideas only: UX-rule categories, semantic color roles, chart thresholds, master+override persistence, density dials. No CSV data, palettes or scripts copied. |
| Leonxlnx/taste-skill | MIT (© 2026 Leonxlnx) | Same | Ideas: multi-width browser verification, image honesty and stand-in ledger, copy tells and the over-correction concept. No kit, assets or scripts copied. |
| pbakaus/impeccable | Apache-2.0 | Attribution; state changes if redistributing the work or derivatives; NOTICE file if present | Ideas: surface modes, craft verify/refuse concepts, four generated looks, isolated critique, Nielsen rubric calibration, P0–P3, command concepts (polish, bolder, quieter, distill, harden, typeset, colorize, animate, delight). Re-expressed in original prose; no code or files copied. Attribution given here. Impeccable's NOTICE.md credits ehmo/platform-design-skills (MIT) for its iOS/Android files. Those native-platform files were not used here. |
| Nutlope/hallmark | MIT (© 2026 Hallmark contributors) | Same as MIT | Ideas: tiered gates with reasoned waivers, fresh-context review, anatomy by visitor job, preservation ledger, capture real product. No files copied. |
| emilkowalski/skills | MIT (© 2026 Emil Kowalski) | Same | Ideas and values: frequency gate, easing/duration guidance, origin-aware motion, choreography roles, gesture thresholds, reduced-motion philosophy, review format. Common easing curves are cited as values. No code copied. |
| heydamir/unslop | **CC-BY-4.0** | **Attribution required** for adapted material: credit, link to the license, indicate changes | Adapted ideas: triage levels, approval before redesign, the nine-pass refinement order (re-expressed), "quiet chrome, rich moments", dashboard proportions. **Attribution:** "Refinement pass order and triage concept adapted from *unslop* by heydamir (https://github.com/heydamir/unslop), licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: rewritten, merged with other sources, reordered into a unified workflow." |
| VoltAgent/awesome-design-md | MIT (© 2026 VoltAgent) | Same | Methodology only: DESIGN.md section structure and cross-brand token patterns. **No brand identity, palette or brand-specific file reproduced.** The brand files are interpretations of third-party trademarks; those brands' identities are not ours to reuse. |
| shadcn-ui/ui | MIT (© 2023 shadcn) | Same | Conventions: token pairs, composition, accessibility requirements, DESIGN.md→variable mapping. No component code copied. |
| DavidHDev/react-bits | **MIT + Commons Clause** | Commons Clause: may not sell, sublicense or redistribute the components, ports or bundles | **No code included.** The skill only names effect categories and gives guidance on when they suit; it tells users to install from the official source into their own projects. This skill must not be extended with React Bits code. |
| vercel-labs/web-interface-guidelines | MIT (© 2025 Vercel Labs) | Same | Rules paraphrased and merged: forms, loading timing, URL state, hit targets, performance, i18n. |

Standards referenced: W3C WCAG 2.2, WAI-ARIA Authoring Practices, Nielsen's 10 usability heuristics, Core Web Vitals (Google), APCA (as an aid). Platform facts: Elementor, WordPress, WooCommerce and Shopify public documentation and product behavior.

## Redistribution note
If you share this skill publicly, include this file. The Apache-2.0 and CC-BY-4.0 attributions above satisfy the credit requirements for the adapted ideas. MIT notices are not strictly required because no substantial portions were copied, but crediting them is good practice.

## Integrity notes
- Repositories were cloned into an isolated staging directory and read as untrusted data. No repository script was executed, and no instructions inside them were followed.
- No dependencies, paid APIs, external AI services or background services were added. The scripts use only Node.js built-ins and a locally installed Chrome/Edge.

## Design-reference platforms (Dribbble, Pinterest, live websites)
These are used at runtime for *inspiration only*, under each platform's terms of service:
- No bulk scraping. `refgrab.mjs` is sequential, delayed and capped per run.
- No bypassing of login walls, CAPTCHAs or rate limits.
- No redistribution or publication of captured screenshots or preview images; they stay in the private research folder.
- No reproduction of others' artwork, photography, illustrations, logos, copy or code in deliverables.
- Creators are credited by name and URL in the internal research report.
- The originality guard in `references/visual-research.md` §6 is the safeguard against derivative work.

## v2 sources (2026-11-12 QA upgrade)
| Source | License | Use |
|---|---|---|
| anthropics/skills `frontend-design` | Apache-2.0 | Ideas adapted, in original wording: the plan → "would a similar prompt land here?" self-check → revise loop; named AI-default clusters (incl. the cream + serif + terracotta ~#D97757 look); "remove one accessory"; outcome-named CTAs. Attribution: "Concepts adapted from Anthropic's frontend-design skill (Apache-2.0)." |
| anthropics/claude-cookbooks, *Prompting for frontend aesthetics* | MIT | The "extremes" option (weight and size contrast), dominant-plus-sharp-accent palettes, per-dimension steering. |
| OneRedOak/claude-code-workflows `design-review` | MIT | Reviewer ideas: live render first, "problems over prescriptions", severity labels, opening with strengths. |
| cuellarfr/design-skills | MIT | Questioning every default ("design interrogation"); separating functional and perceptual decisions. |
| emersimeon/claude-elementor-kit `LESSONS.md` | MIT | Elementor MCP settings quirks, rewritten as "verify against the schema" guidance. |
| JCarterJohnson/vibecoded-design-tells | MIT | Reddit-derived findings (3.2M posts via Arctic Shift; 3,033 comments) used for tell weights, the "tasteful default" trap, "fix by choosing, not swapping", the ignore-comment idea and the image-share observation. Findings are the study's, not our own reading of Reddit. Quoted comments belong to their authors. |
| Adrian Krebs, "design slop" analysis (adriankrebs.ch) | blog, cited | The cluster rule: one tell proves nothing; act on ≥3. |
| gnurio/refactoring-ui-plugin | All rights reserved | **Excluded.** No text used. |
| msrbuilds/elementor-mcp | GPL-2.0 | Not used (ideas only via the MIT kit notes; no code copied). |

## v3 sources: Vector Graphics & Illustration Engine (2026-11-12)
See `vector-engine-sources.md` §4. In short:
- logo-design-skill, claude-illustrate-skill and ai-graphic-design-skill are MIT; their ideas are re-expressed and credited.
- The trademarked logo library was excluded.
- Kubai Icons: only facts about its MIT packages are used. Its method files are not adapted, and no icons are bundled.
- `svgcheck.mjs`, `svgexport.mjs` and `trace.py` are original code.
