# Creative Art Direction
Contents: 1. Decide what is already true · 2. Discovery: ask once, briefly · 3. Build the direction · 4. Calibration: the four generated looks · 5. Mode-specific ambition · 6. Inspiration vs implementation · 7. Output: the Direction Brief  _(read only the section you need)_

Goal: give every project its own personality, derived from evidence rather than habit. The test of a direction is whether someone could guess it from the industry name alone. If they could, it is not a direction yet.

## 1. Decide what is already true (always first)

| Situation | What you do |
|---|---|
| **Established brand** (logo, colors, fonts, guidelines, coherent existing site) | Inherit it. Extend and sharpen; never replace silently. |
| **Incomplete brand** (logo and a color, nothing else) | Preserve the assets and build a system around them. |
| **Redesign requested** | Keep product truth, content, functions and brand marks. Treat the old *look* as evidence of what to change, not as a constraint. Don't polish a look you've decided to discard. |
| **No authority** (new product, nothing given) | Create a new world using the process below. |
| **Component inside an existing surface** | Inherit that surface. Never turn it into an identity exercise. |

Brand evidence lives in code: CSS custom properties, Tailwind config, Elementor Global Colors/Fonts, theme.json, the logo SVG. Read it before proposing anything. When fetching a live site to learn its brand, cluster the actually-used colors and fonts from its CSS; never theme a real brand from memory.

## 2. Discovery: ask once, briefly

Ask only what you cannot infer, in one round of at most 3 to 4 questions. Lead with your best reading so the user corrects rather than authors. Never ask for CSS values. Cover:
- **Audience and job:** who arrives, and what one action defines success (book, buy, call, sign up, request a quote, read, hire).
- **Proof on hand:** real photos, product screenshots, reviews, numbers, certifications, press.
- **Tone at the extremes:** "clean and modern" is not a tone. Push for opposites: "workshop-honest, not luxury", "clinical-calm, not playful".
- **Hard constraints:** brand rules, platform, pages, deadline, things that must not change.

If the user says "just go", infer, then state what you inferred in the handoff. Facts (prices, claims, addresses) are never inferred.

## 3. Build the direction (Persuade / Experience surfaces)

1. **Name the unique mechanism.** In one sentence, say what is true of this business that is not true of its competitors. Everything visual should serve this sentence.
2. **Name the rut.** Describe the predictable page for this category (for example, automotive: dark hero, glossy car, red accent, "Experience the drive"). Also describe its predictable opposite, which is equally a rut. You need a third option.
3. **Mine the world.** List 5 to 7 concrete things from the audience's or trade's real world: materials, tools, documents, places, rituals, signage, packaging, instruments. A truck wash has pressure gauges, bay numbers, chemical drums, ticket stubs and floodlit night shifts. A law firm has case files, margins, seals and paper stock. Directions are built from these, not from "styles".
4. **Draft 2 to 3 directions**, each fully committed and each described by:
   - a **North Star** name ("Night Shift Ledger", "Bay 3 Logbook"); avoid virtue words like quiet, honest or crafted;
   - world references (from step 3);
   - **color strategy** and anchor hues (see `typography-and-color.md`);
   - **type voice** (what kind of letterform belongs in this world, and why);
   - **layout posture** (dense or airy, symmetric or asymmetric, editorial or modular);
   - **image direction** (subject, light, crop, what is shown and what never is);
   - **signature move**, the one memorable thing (a type treatment, a structural device, a product-literal interaction);
   - **refusals**: three things this direction will not do.
5. **Pick and justify.** Recommend one and say why it beats the others for this audience and job. For user-facing choices, present the options compactly and wait. For "just do it" requests, pick and proceed.
6. **Write the light/dark decision as a scene.** One sentence: who uses this, where, and under what light. "Fleet managers on a desktop in a bright office" means light. "Nightclub guests on a phone at 1am" means dark. Never choose dark because it "looks premium".

## 4. Calibration: the four generated looks

Unprompted AI interfaces collapse into a few recognizable looks. Each is acceptable *when the brief asks for it*. When the aesthetic was left to you and your result matches one of them, rework it.
1. Cream/beige paper, a high-contrast or italic serif, and a terracotta or rust accent ("warm editorial").
2. Near-black with one neon or cyan/violet accent, glows, and gradient text ("dark tech").
3. Broadsheet hairlines, an italic display serif, and tiny tracked uppercase mono labels ("fake newspaper").
4. Flat saturated color, black outlines, hard offset shadows, and condensed type ("default neo-brutalism").

Plus the SaaS template: a centered hero with a badge pill, gradient headline and two buttons, then three icon-tile feature cards, a logo strip, a testimonial grid, pricing in three cards and an email capture.

## 5. Mode-specific ambition

- **Persuade:** the first viewport is a thesis, not a header. The memory test: what would a visitor describe an hour later? If the answer is only a mood ("it was dark and sleek"), the concept hasn't committed. Prove, don't claim: show the product, the place or the work.
- **Operate:** ambition shows as precision. Use familiar patterns and calm surfaces, and put the brand in the details (type, one accent, iconography, empty states). No page-load choreography.
- **Read:** structure for comprehension first (measure, hierarchy, wayfinding), then add one quality that makes reading a pleasure.
- **Experience:** the artifact leads. Chrome is minimal and navigation is quiet. Images are big or absent.

## 6. Inspiration vs implementation

Research references per `visual-research.md` (tiers, Dribbble/Pinterest/live sites, synthesis) to extract **principles**: proportion, rhythm, how proof is presented, how type carries hierarchy. Never copy a reference's layout, brand identity, illustrations or copy. If a result could be mistaken for the reference brand, it has gone too far.

## 7. Output: the Direction Brief

Record this before building, in chat or in `DESIGN.md` §Overview. It includes the mandatory **4-line Spec** (reference, color + source, type + reason, layout intent). Then run the decision ledger and the same-prompt test in `design-generation.md` §3–4. When drafting directions, they must diverge on ≥3 axes (§5 there).
```
Spec: Reference <site/brand/named direction> · Color <decision> from <source> · Type <decision> because <reason> · Layout <intent from goal>
Surface mode: Persuade
North Star: <name> — <one sentence>
Audience / job: <who> must <do what>; proof = <what we can show>
World: <5-7 concrete references>
Color strategy: <Restrained|Committed|Full|Drenched>, anchors <hues + why>
Type voice: <display face role> + <text face role>, because <reason>
Layout posture: <...>
Imagery: <subject, light, crop; never X>
Signature move: <one thing>
Refusals: <3 things>
Light/dark scene: <sentence>
```
