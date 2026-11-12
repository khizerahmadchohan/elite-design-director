# Consistency Audit (section-level + page-level)

Evidence: `shoot.mjs --around "<selector>"` at 390 and 1440 for the section, `--full` for the page, plus screenshots of the homepage and 1–2 other pages.

**Site Language Sheet**
- [ ] Extracted from the rendered site (colors, type, spacing, components, surfaces, imagery, motion, header/footer) or reused from DESIGN.md.
- [ ] Rhythm map written for the page.

**Level A: section in context**
- [ ] Uses only existing color roles (or a documented new token).
- [ ] Heading and body styles match sibling sections (same scale steps, weights, case, tracking).
- [ ] Buttons, cards, inputs, icons and radius match the site's components.
- [ ] Section padding and container width match the site's scale.
- [ ] Entry and exit transitions with neighbors look intentional; no clashing adjacent backgrounds; no stacked primary CTAs.
- [ ] Its variation (composition, background, density) is purposeful and still reads as the same brand.
- [ ] No reference-borrowed element that introduces a foreign visual language.

**Level B: page and site**
- [ ] One coherent hierarchy and story from hero to footer; the signature moment is placed at the peak.
- [ ] No adjacent sections with the same composition + background; card grids not repeated more than twice.
- [ ] Density alternates; backgrounds follow a deliberate sequence.
- [ ] Consistent with the homepage and other pages (header, footer, type, buttons, imagery treatment).
- [ ] Mobile view checked as a whole page, not just per section.

**Verdict:** Level A pass/fail · Level B pass/fail · fixes applied · remaining site-level issues recommended (not silently changed).
