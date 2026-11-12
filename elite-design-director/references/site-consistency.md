# Website-Wide Consistency and Controlled Variation
Contents: 1. Read the site's visual language first · 2. Inheritance rules · 3. Controlled variation · 4. Transitions between sections · 5. Two-level consistency check · 6. When the existing site is weak  _(read only the section you need)_

A beautiful section that looks transplanted from another site is a failure. Every new section or page must feel as if it was designed with the rest of the site from day one, while still having its own purpose and character.

## 1. Read the site's visual language first (before research synthesis)
Inspect the real, rendered site, not just the code:
1. Screenshot the homepage and 1–3 relevant pages at 390 and 1440 (`shoot.mjs --full`). For a section task, capture the **neighbors**: `shoot.mjs <page> --around "<selector of the section before or after>"`. Elementor or other CMS: use the preview/staging URL.
2. Extract the **Site Language Sheet** (from the system in code/Globals plus what's actually rendered):
   - **Brand:** logo, primary/secondary/accent colors and how much of each appears, neutrals.
   - **Type:** families, heading scale actually used (H1–H4 sizes, weights, case, tracking), body size and measure, link style.
   - **Space:** section padding (top/bottom per breakpoint), container width, grid and gutter, typical gaps.
   - **Components:** buttons (shape, radius, padding, case, hover), cards, inputs, badges, icons (family, stroke), dividers.
   - **Surfaces:** background sequence (light/tinted/dark/photo), borders vs shadows, radius scale.
   - **Imagery:** photo vs illustration, crop ratios, treatment, corner style.
   - **Motion:** what animates, how, and how much.
   - **Header/footer** and their relationship to page content.
   - **Rhythm map** of the current page (see §3).
3. If the site has an inconsistency (three button styles), don't copy the inconsistency. Follow the dominant or most recent pattern and flag the rest.
4. Record the sheet in DESIGN.md if it doesn't exist; otherwise reuse it.

## 2. Inheritance rules
| Must inherit (never change silently) | May vary deliberately |
|---|---|
| Color tokens and their roles, font families, type scale steps, button styles, radius scale, elevation strategy, icon family, link style, container width, focus style, motion personality | Composition and grid split, background treatment within the palette, image placement and scale, density, section height, the section's signature device, use of the accent at region scale (if the color strategy allows) |

A new token is allowed only when the site lacks one for a genuine need (e.g., no danger color). Add it to the system and DESIGN.md, not as a one-off.

## 3. Controlled variation (consistency ≠ repetition)
Build a **rhythm map** for the page, one row per section:
`# | section | purpose | composition (centered / split L / split R / grid / list / table / full-bleed / editorial) | background (base / tint / dark / brand / photo) | density (open / medium / dense) | signature?`

Rules:
- No two adjacent sections share the same composition *and* background.
- Don't repeat the same card grid more than twice on a page; switch to a list, table, split or single feature.
- Alternate density (dense information followed by an open, breathing section).
- Use backgrounds deliberately (e.g., base → tint → base → dark/brand → base). Avoid random switches, and avoid one flat background for the whole page.
- One signature moment per page (two on long pages), placed where the story peaks.
- Vary image placement and scale across sections; keep crop ratios from the system.
- Each section has one job and one focal point.

## 4. Transitions between sections
Decide how each section enters and exits: a spacing change, a background change (hard edge vs. continuous), an overlap (an image or card crossing the boundary), a divider, or a heading-led entry. Check that:
- vertical padding is consistent with the site's scale (asymmetry is intentional, not accidental);
- two dark or two brand-colored bands don't touch unless they're meant to merge;
- the section's heading level and style match its siblings;
- CTAs don't stack (two primary CTAs within one screen across a boundary).

## 5. Two-level consistency check
**Level A, section in context.** Capture `--around` the new section at 390 and 1440 and look at it *with its neighbors*. Ask:
- Does it fit between them? Any unnatural visual break?
- Same color roles, type styles and component styles?
- Do its proportions (padding, container, heading size) match its siblings?
- Is its variation purposeful (a different composition) rather than foreign (a different language)?

**Level B, page and site.** Capture the full page (`--full`) and compare it with the homepage and 1–2 other pages. Ask:
- Does the whole page read as one art-directed experience from hero to footer?
- Is there a clear hierarchy of moments, with layouts varied but harmonious?
- Do backgrounds and transitions flow?
- Is it consistent with the rest of the site and the brand?

If either level fails, refine before declaring done. Report both verdicts in the handoff (`checklists/consistency-audit.md`).

## 6. When the existing site is weak
If the established language is itself poor (generic, inconsistent, inaccessible), don't silently "fix" it inside a single-section task. Design the section to fit the *best* parts of the current system, meet accessibility regardless, and recommend a system-level refinement or redesign in the handoff. Contrast/AA fixes are never deferred.
