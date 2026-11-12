# Anti-Generic Design Audit

Write your own visual impression **before** running `scripts/slopscan.mjs`. For each item: **clear**, **found → fixed**, or **kept (reason)**.

**Data-weighted first** (`anti-ai-design.md` §1b): is there a cluster of ≥3 medium/high tells (slopscan vibe score)? Is the result the "tasteful default" (cream + elegant serif + sage/terracotta)? Is the page mostly icon cards with no imagery?

**Identity tests**
- [ ] Same-prompt test passed (`design-generation.md` §4), **per section** too (no default mid-page patterns: 01–04 process band, 3 highlighted pricing cards, 2-col FAQ, image-left/text-right about, placeholder walls; §8b).
- [ ] Signature carried into ≥2 more sections; no raw "PLACEHOLDER:" copy visible.
- [ ] Swap test: a competitor's name would *not* fit unchanged.
- [ ] Skeleton test: the structure alone says something specific.
- [ ] Memory test: a visitor could describe one concrete thing an hour later.
- [ ] Doesn't match one of the four generated looks (warm-editorial cream, dark-neon tech, fake-broadsheet, default neo-brutalism) unless the brief asked for it.
- [ ] Not the default SaaS template sequence.

**Color/surface**
- [ ] No unmotivated purple/blue/pink gradients, neon-on-black, glow halos, gradient text, aurora/mesh blobs.
- [ ] No decorative glassmorphism.
- [ ] Palette tuned from the brand, not framework defaults.

**Type**
- [ ] Faces chosen for stated reasons (not the overused list by default on Persuade surfaces).
- [ ] No eyebrow/kicker label above every heading; no tracked-caps micro labels as decoration.
- [ ] Clear hierarchy; no single italic "flair" word.

**Layout/components**
- [ ] No repetitive identical card grids or default bento.
- [ ] No icon tiles above every card heading; no emoji icons; one icon family.
- [ ] No nested cards; no thick left-border stripes on rounded cards; not border+shadow on every card.
- [ ] Sections vary composition by content; no three identical consecutive compositions.
- [ ] No badge-pill clutter, decorative section numbers, pulsing dots, fake browser chrome, decorative grid backgrounds.

**Imagery**
- [ ] Real photos/product shown; no generic stock clichés; no shape-assembled SVG illustration.
- [ ] Stand-ins logged; nothing presented as the client's own when it isn't.

**Motion**
- [ ] No fade-up on every section; ≤1 authored entrance; no hover-scale on every card/image; no bounce on UI; no custom cursor.

**Copy**
- [ ] No hype words, stock phrases, "Whether you're…", two-fragment slogans, rebuttal cadence, virtue-word substitutes.
- [ ] CTAs are verb+object; no invented metrics/testimonials/logos.

**Waivers:** list each kept pattern with its reason. More than ~5 → document as house style in DESIGN.md.
