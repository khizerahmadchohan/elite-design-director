# Professional Logo Design
Contents: 1. Brief · 2. Strategy · 3. Mark types · 4. Concepts · 5. Construction · 6. Optical corrections · 7. Small sizes · 8. Kit · 9. Red flags · 10. Honesty  _(read only the section you need)_

Logos are the most anti-default work there is: the mark must belong to one name and one business. Process: `workflows/logo-creation.md`. SVG standard: `vector-engine.md` §4.

## 1. Brief (ask once, at most 5 questions, or state assumptions)
1. Exact name spelling and casing, the one-line offer and any tagline.
2. Audience, and where they meet the logo (app icon, signage, vehicle wrap, embroidery, favicon, packaging).
3. **3–5 brand adjectives**, plus their opposites to avoid. This is the most useful single input.
4. Competitors to stand apart from, and marks the client admires.
5. Constraints: existing colours and equity, required uses, **the smallest use size** (it binds everything), deadline, who approves.
Also pick one dominant brand archetype (and at most one secondary). Mixed archetypes produce mixed marks.

## 2. Strategy
- **Category conventions and clichés:** list the category's predictable motifs and treat them as banned unless reinvented. Examples: fintech uses up-arrows, shields and globes; automotive uses swooshes, checkered flags, generic car silhouettes and chrome; coffee uses beans and steam; SaaS uses abstract blobs and gradient orbs; real estate uses roofs and keys.
- **Word map:** name + offer + adjectives + promise → nouns, metaphors, verbs, opposites. Circle the intersections; ownable ideas live there.
- Explore **at least 2 mark types** (§3).

## 3. Mark types and when to use them
| Situation | Lead with |
|---|---|
| Name ≤ ~8 letters and distinctive | Wordmark (custom-modified letterforms) |
| Long or awkward name | Lettermark / monogram |
| Name or story suggests a vivid image | Pictorial mark |
| Idea without an object, high exposure planned | Abstract mark |
| Lives mostly as app icon / avatar | Letterform or compact symbol first |
| Heritage, authority, clubs, automotive service, craft | Emblem / badge with a simplified inner symbol (it must work without the outer frame) |
| Warmth, play, community | Mascot, with a simplified head version for small sizes |
| Parent brand with sub-brands | System: fixed core + variable parts |
| Negative space idea available | Negative-space mark (design the negative shape first) |
Combination marks pair any symbol with the wordmark in fixed lockups. When in doubt, explore 3 types.

**Sector notes:**
- **Tech/SaaS:** compact symbol + wordmark; must work at 16 px and as an app tile.
- **Automotive:** strong silhouettes, motion through geometry rather than swooshes; works on vehicle wraps, signage and embroidery.
- **Luxury:** restraint, custom letterspacing, monograms, fine but not hairline strokes, one colour.
- **E-commerce:** favicon and app-icon strength, friendly but simple.
- **Agencies and personal brands:** monogram or wordmark carrying a personal idea.
- **Corporate:** durable, symmetrical systems, clear lockups.

## 4. Concepts (funnel, cheap to rich)
1. Write **8–12 one-sentence concepts**, each with an ownable twist. If a sentence could describe a competitor's logo, discard it.
2. Score each 1–5 on idea clarity, distinction, simplicity, relevance and small-size strength. Pick the **3 strongest that are also most different from each other**: different mark type, structure and metaphor, not three weights of one idea.
3. Build the 3 in SVG (§5), **black first**, colour later. Present them greyscale with one colour hint so the discussion is about form.
4. **Checkpoint:** show the 3 with name, idea, why it fits, one honest risk and a recommendation. Then **stop** and wait for a choice before building the full kit, unless the user said not to check in.

## 5. Construction (SVG)
- Describe the geometry in words before coding ("circle r=96 at 128,128, remove a 45° wedge from the upper right…").
- Canvas `0 0 256 256`, padding 4–8% (or a tight crop plus a clear-space rule; pick one and keep it).
- **Grid unit** 8 or 16. Reuse a short list of radii and angles. Use clean angles only: 0/15/30/45/60/75/90°, computed with trigonometry (sin 30 = 0.5, cos 30 = 0.866). Near-misses (0.3–3° off) look like mistakes.
- Build with primitives, then merge into one silhouette path per colour. Use arcs for circles; quarter-circle handle 0.5523r. For squircle corners, start the curve about 1.3× the corner size before the corner with handles about 0.6×.
- Negative space via `fill-rule="evenodd"`. No white "fake knockouts" painted over a shape.
- Monoline marks: stroke ≥ 8% of mark width if it must read at 24 px. Explore with strokes, but masters are **outlined fills**.
- Letterforms: modify a licensed typeface or construct from geometry. Run the **letter test**: every modified letter still reads as itself.
- Golden ratio and grids are for **finishing**, not starting. Break the grid when the eye says so.
- Save iterations `-v1`, `-v2`…

## 6. Optical corrections
- Round and pointed forms **overshoot** the baseline/cap line: 1–3% of height for curves, 3–6% for apexes.
- Horizontals 5–10% thinner than verticals at equal visual weight.
- Optical centre sits slightly above the geometric centre.
- **Reversed** (light on dark) versions: thin strokes by 2–5% to counter irradiation.
- Inspect junctions for notches, slivers and lumps where strokes meet.

## 7. Small sizes
- Nothing smaller than about **1/48 of the mark**. At 32 px, a 1 px gap disappears.
- Test at 16, 24, 32, 48, 64 and large. If 16 px fails, draw a **simplified favicon companion** (fewer elements, thicker strokes, bigger gaps) and export with `--favicon-source`.
- **Readings test:** mirror, rotate 180°, view tiny. Check for unintended shapes or rude readings.

## 8. Kit (after approval)
- **Variants:** full colour, one-colour (black and white), brand mono, reversed (thinned), `currentColor` UI variant, favicon/app icon. Make dark-mode versions explicit (see `svg-illustration.md` §6).
- **Lockups:** horizontal, stacked, symbol-only, wordmark-only, with locked proportions and spacing.
- **Colour:** 1–2 colours, with HEX, RGB, whole-number CMYK and a Pantone suggestion. Flag colours out of the CMYK gamut (neon, electric blue, bright orange). Check contrast on intended backgrounds.
- **Type:** at most 2 families; a license that permits logo use.
- **Guidelines:** clear space derived from an element of the mark, minimum size in px and mm, approved backgrounds, misuse examples.
- **Exports:** `node scripts/svgexport.mjs master.svg --out kit --variants --png 32,512,1024 --web-icons [--favicon-source fav.svg]`.
- **Presentation:** `vector-mockups.md`.

## 9. Red flags (reject before showing)
Clip-art literalism (a car for a car business); stock-font initials in a circle; more than 3 colours without a reason; gradients or shadows rescuing a weak form; details under 1/48; near-miss angles; live text, rasters, filters or masks in finals; resemblance to an existing mark; the category cliché unchanged; three concepts that are one idea.

## 10. Honesty
No trademark clearance can be guaranteed: recommend a professional search. Font licences must allow logo use. AI-generated marks may have weaker copyright, which hand-authored construction helps. State untested items.
