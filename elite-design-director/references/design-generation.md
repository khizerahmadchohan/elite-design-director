# Design Generation
Purpose: the generative engine that turns a brief into a specific, non-convergent plan before any code.

Contents: §1 Why convergence · §2 4-line Spec · §3 Decision ledger · §4 Same-prompt test · §5 Divergent directions · §6 Cross-project history · §7 Hero archetypes · §8 Section archetypes · §9 Image share · §10 Finishing moves · §11 Extremes

## §1 Why convergence happens
- Models drift to the highest-probability look for a prompt. Ban one cliché and output slides to the next most probable one.
- Fixes become tells: Space Grotesk, Instrument Serif, cream + serif + terracotta/sage all started as "escape the purple gradient" moves; now they mark AI output.
- A tell is an **unspecified default**, not a forbidden color or font. Any choice is fine if it was chosen for a reason traceable to the brand.
- Fix by choosing, never by swapping. Replacing font A with font B without a reason just relocates the default.
- See `anti-ai-design.md` for the tells catalogue; this file is how to generate past it.

## §2 The 4-line Spec (mandatory before building any Persuade/Experience surface)
| Line | Must contain | Reject |
|---|---|---|
| Reference | A real site, brand, screenshot, object, or named direction ("1970s Swiss rail timetable") | "modern and clean", "sleek", "premium" |
| Color + source | The decision and where it came from: product photo, material, logo, place, uniform, signage | "brand blue" with no anchor; palette from nowhere |
| Type + reason | Display/text faces and why they fit the voice | "a clean sans" |
| Layout intent | Skeleton derived from the page goal (book, compare, browse, trust) | "hero, features, testimonials, CTA" |

Write it in four lines. If a line can't be filled, run discovery (`creative-art-direction.md` §2) or `visual-research.md` first.

## §3 Decision ledger
Every row ends in "because <brand fact>". No brand fact means the row is a default; revisit it.

| Dimension | Decision | Because |
|---|---|---|
| Display / text type | | |
| Color strategy + anchor hex | (mono, duotone, accent-on-neutral, full-color field…) | |
| Layout skeleton | (asymmetric split, index, long-scroll chapters, catalog grid…) | |
| Hero archetype | §7 | |
| Imagery mode | (real photo, product UI, illustration, diagram, type-only) | |
| Motion thesis | One sentence: what motion means here | |
| Signature device | The one memorable thing | |
| Radius / elevation | (0 / 2 / 12 px; flat / hairline / shadow) | |

## §4 Same-prompt test
For each ledger row ask: **"Would a similar brief for a competitor land on this same plan?"**
- Yes → revise that row; record old choice, new choice, and the brand fact that justified it.
- Aim: at least 3 rows a competitor could not copy without it feeling wrong for them.

**Tasteful-default check** — rework unless the brief asked for it:
| Pattern | Why it's a tell now |
|---|---|
| Cream/beige + elegant serif + sage/forest/terracotta | The default "warm artisan" escape |
| Near-black + one neon/acid accent | The default "techy bold" escape |
| Broadsheet hairlines + italic serif + tracked mono labels | The default "editorial" escape |
| Saturated flat colors + hard offset shadows | The default "neo-brutalist" escape |

## §5 Divergent directions
Produce 2-3 directions that differ on **≥3 named axes**. Two palettes on one layout is one direction.

| Axis | Direction A | Direction B | Direction C |
|---|---|---|---|
| Type genre | | | |
| Color strategy | | | |
| Layout skeleton | | | |
| Imagery mode | | | |
| Signature device | | | |
| Differs from A on | — | n axes | n axes |

Persuade heroes: build 2 hero variants (same content, different §7 archetype), screenshot both at 390 and 1440, pick by looking, not by arguing. Cheap: one file, toggled class.

## §6 Cross-project history
- At planning: read the last ~10 lines of `${CLAUDE_SKILL_DIR}/history/log.jsonl`.
- Avoid repeating from recent projects: same display face; same anchor hue family (±20° hue); same hero archetype; same signature device. Override only when the brand requires it (existing identity, client mandate) and note why.
- At handoff append one line:
`{"date":"YYYY-MM-DD","project":"nickname","surface":"landing","display_font":"","text_font":"","anchor_hex":"#","strategy":"","hero_archetype":"","signature":"","mode":"Persuade"}`
- Never store client secrets, credentials, personal data or private URLs.

## §7 Hero archetype catalog
| Archetype | What it is | Best for | Watch-outs |
|---|---|---|---|
| Editorial split | Asymmetric 7/5: headline column vs image/object | Services, studios, B2B with a story | Turns generic at 6/6 with stock photo |
| Full-bleed photo + calm field | One strong photo, text in a quiet area of it | Hospitality, places, crafts | Needs real photo; text contrast |
| Product-in-use screenshot | Oversized real UI, cropped | SaaS, tools | Fake dashboards; illegible tiny UI |
| Live demo / interactive | The product works in the hero | Dev tools, calculators, configurators | Load cost; must work at 390 |
| Spec sheet / ledger / work order | Hero styled as the trade's own document | Industrial, trades, logistics | Real fields only, no lorem |
| Index / table of contents | Hero is a navigable list of offers | Multi-service, publishers, agencies | Weak without strong type |
| Map / location-led | Service area or venue map | Local services, venues, delivery | Tile licensing; mobile pan traps |
| Big-type statement | Display copy carries it alone | Strong, specific claim | Only with real, specific copy |
| Before / after | Paired states, slider or side-by-side | Cleaning, renovation, editing tools | Must be genuine pairs |
| Menu / price-led | Items and prices up front | Restaurants, local services, trades | Keep prices current |
| Founder / maker portrait | Person + first-person line | Solo practices, makers, consultants | Needs a good real portrait |
| Data moment | One real chart or number with source | Research, finance, impact orgs | Cite source; no decorative charts |
| Catalog grid | Real products as hero | Shops, collections | Consistent product photography |
| Video-led | Loop or reel with poster frame | Events, film, motion brands | Poster, `prefers-reduced-motion`, captions, weight |
| Document / letter | Hero reads as letter or memo | Advisory, legal, nonprofits | Needs genuine voice (`copy-and-voice.md`) |

## §8 Section archetypes
| Type | Option | When | Avoid |
|---|---|---|---|
| Proof | Quote wall | Many short real quotes | Fake names, stock avatars |
| | Case-study strip | B2B, high consideration | Outcomes without numbers |
| | Logos | Only with permission | Logo soup without context |
| | Review aggregate | Real platform rating + source link | Unsourced stars |
| Process | Numbered timeline | Steps truly sequential | Numbering non-sequential items |
| | Map | Geographic/route process | Decorative maps |
| | Checklist | What's included / what to prepare | Icon grid of verbs |
| Pricing | Comparison table | 2-4 tiers with real differences | Hiding the real price |
| | Single price + inclusions | One offer | Tier padding |
| | Calculator | Variable price | Inputs without defaults |
| | Work-order sheet | Trades, quotes | Fake line items |
| | Vehicle/size matrix | Price by size/type | Unscannable at 390 |
| Features | Alternating split + real visuals | 3-5 major features | Same icon card ×6 |
| | Annotated screenshot | UI products | Unreadable callouts |
| | Spec list | Technical buyers | Marketing adjectives |
| | Tabs | Parallel use cases | Hiding key info |
| About | Founder letter | Small, personal brands | Corporate "we" |
| | Timeline | Real long history | Invented milestones |
| | Team grid | Real photos exist | Silhouette placeholders |
| FAQ | Two-column editorial | Pre-purchase objections | 20 accordions of filler |
| Contact | Map + hours + tap-to-call | Local business | Form-only |
| | Form + expectation line | B2B, quotes ("Reply within 1 business day") | Many required fields |
| Footer | Useful sitemap + contact + legal | Always | Social icons as the only content |

## §8b Whole-page commitment (the mid-page slump)
Independent reviews of v2 test builds scored strong heroes but **template middles**: the same sections reverted to defaults on every page. Rules:
- **Every section names its archetype** from §8 in the rhythm map, with a one-line reason. "Default" is not an archetype.
- **Default section patterns** count as tells unless justified by content:
  - a numbered 01–04 process row on a dark band;
  - three pricing cards with the last or middle one highlighted;
  - a two-column FAQ (heading left, list right);
  - an image-left/text-right "about" split;
  - a 4-cell footer row;
  - a grid of empty placeholder boxes.
- **Carry the signature:** the signature device or its visual language recurs in **≥2 more sections**, not only the hero. For example, a survey-drawing hero continues in project plans; a vehicle-scale drawing continues in the pricing matrix.
- **Same-prompt test per section:** run §4 on each mid-page section, not just the page.

**Placeholders must be designed, not dumped:**
- No raw "PLACEHOLDER:" strings in visible copy. Use a consistent, quiet placeholder style (e.g., a small tinted tag), and list the items in the handoff.
- Hide unanswered FAQ items and unconfirmed claims instead of showing empty answers.
- Without photos, use the signature language (plans, drawings, real data, type) instead of walls of hatched boxes. On mobile, show at most one placeholder slot per section.

**Mobile is designed, not stacked:**
- Parallel content (typologies, plans, packages) becomes swipe rows with a peek, or accordions.
- Keep the mobile page height reasonable: if it runs over ~2× the desktop full-page height, compress.
- Crops in the first viewport must be intentional, never a sliver of an illustration.

## §9 Image share
- Persuade pages: target ~30-50% of visual area as real imagery, product shots, or authored visuals. (A design-community observation: strong sites often run near half images; pages built only from icon cards read as AI.)
- No assets: design explicit image slots (ratio, crop, art-direction note) and compensate with stronger type-scale contrast, composition and color fields. Missing photos must not cap originality. Sourcing: `imagery-and-visual-storytelling.md`.

## §10 Finishing moves
- Remove one accessory: before shipping, cut the weakest decorative element.
- One signature, not five. Extra devices dilute the memorable one.
- Motion coherence: container and content move as one object; no child fades fighting the parent.
- Then run `checklists/last-10-percent.md` and `agents/design-reviewer.md`.

## §11 Extremes as a tool (not a default)
| Lever | Move | Use when |
|---|---|---|
| Weight contrast | 200 vs 800 in one lockup | Bold direction; face has the range |
| Size jump | Display ≥3× the next heading step | One statement must dominate |
| Width | Condensed display + normal-width text | Dense info under a loud headline |
| Color | Full-bleed brand field | Anchor color is genuinely ownable |

Extremes everywhere become the new default. Use one or two per page.
