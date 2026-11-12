# Anti-Generic Design Engine
Contents: 1. The core idea · 1b. What people actually notice · 2. Tells catalogue · 3. What to do instead · 4. Detection workflow · 5. Redesigning AI-generated sites without destroying them  _(read only the section you need)_

Generic output comes from accepting defaults. This file lists the defaults that make a UI look machine-made, how to detect them, and what to do instead. **Nothing here is banned when the brief or direction genuinely calls for it.** The rule is: *no unexamined defaults*. If you use one of these patterns, you must be able to name the project-specific reason.

## 1. The core idea

Generic UI spreads decoration evenly over the chrome (gradients, glows, badges, icons, cards) and leaves the content thin. Crafted UI keeps the chrome quiet and puts the richness into one or two **content moments**: a real product shot, a working demo, a striking photograph, a data visualization, or a typographic statement built from real copy.

Three tests catch almost everything:
- **Swap test:** put a competitor's name on the page. If nothing else needs to change, it's generic.
- **Skeleton test:** strip all copy. Does the structure alone still say something about this brand? If it's only a stack of centered blocks, it's generic.
- **Squint test:** blur your eyes. You should see one primary focal point per view, then 2–3 secondary ones, then quiet. If everything has equal weight, nothing has hierarchy.

## 1b. What people actually notice (data-weighted)
A study of 3,033 Reddit comments from 125 "why do AI sites all look the same" threads (vibecoded-design-tells, MIT) found that the top complaint is **sameness itself**: "screams AI/soulless" (6.4%) and "all looks the same" (6.1%). Specific features follow:

| Weight | Tell | Share |
|---|---|---|
| High | Default shadcn/Tailwind kit look | 2.5% |
| High | "AI purple"/violet | 2.3% |
| High | Gradients everywhere / gradient text | 2.0% |
| Medium | Fade-ins on everything | 1.1% |
| Medium | One radius/pill on everything | 0.8% |
| Medium | Dark + neon glow | 0.7% |
| Medium | Emoji/✨ in UI | 0.5% |
| Medium | Inter/Geist as the only face | 0.4% |
| Medium | Centered hero + 3 feature cards | 0.4% |
| **Low** | Glassmorphism | 0.2% |
| **Low** | Bento grid | 0.1% |
| **Low** | Mesh/aurora backgrounds | rejected as noise |

The same study found that a common fix is itself a tell: icon-card pages with **no imagery** ("good sites are often ~50% images").

**Rules from the data:**
1. **One tell alone proves nothing.** Act when **≥3 distinct medium/high tells cluster** (`slopscan` vibe score).
2. **Low-signal patterns** (bento, glass, mesh) are judged in context, not flagged by default.
3. **A tell is an *unspecified default*, not a banned color.** Fix by **choosing** (a reason tied to the brand), never by **swapping** one default for another.

**The "tasteful default" trap (current Claude house style):** cream/beige ground + Instrument Serif / Fraunces / Playfair display + sage, forest or terracotta (~#D97757) accent. It is now recognized as instantly as purple gradients were in 2024. Treat it as a tell unless the brand demands it. Related clusters to check are listed in `design-generation.md` §4.

## 2. Tells catalogue (detect → why it reads generic → better default)

### Color and surface
| Tell | Better default |
|---|---|
| Purple/violet→blue or pink gradients; "AI purple" accent | Hue derived from the brand's world; solid fields |
| Cyan or neon on near-black with glows | Dark only if the use-scene is dark; depth from surface steps |
| Gradient-filled headline text | Solid ink; emphasis through size, weight or a real color field |
| Zero-offset colored glow / halo shadows, radial spotlight washes behind hero | Real lighting in photography, or no effect |
| Default cream/beige ground with serif + terracotta | Choose ground from the scene; tint neutrals toward the brand hue |
| Decorative glassmorphism, frosted cards over blobs *(low-signal, judge in context)* | Opaque surfaces; glass only over real moving content (video, map) |
| Mesh/aurora blobs as the hero "visual" *(low-signal as a tell; still weak as the only visual)* | An authored asset: photo, product, diagram, type |
| Cream ground + elegant serif + sage/forest/terracotta ("tasteful default") | A ground and accent sourced from the brand's real world |
| Near-black + one acid-green/vermilion accent | The use-scene decides light or dark; accent from the brand |
| Tailwind-default palette steps used as-is (blue-600 on slate-50) | Tuned OKLCH ramp from the brand anchor |

### Type
| Tell | Better default |
|---|---|
| The same few faces chosen without reason (Inter/Roboto/Poppins/Montserrat/Open Sans as display; Space Grotesk, Plus Jakarta, DM Sans, Outfit, Syne; Playfair/Fraunces/Cormorant as "luxury") | Pick a face for a reason tied to the world (see `typography-and-color.md` §Choosing faces). In Operate-mode app UI, a neutral workhorse sans (including Inter) is fine. |
| Tiny tracked UPPERCASE eyebrow/kicker above every heading | Let the heading stand alone; when a label is informative, use sentence case and integrate it into the layout (e.g., a running header, a margin note) |
| One italic word inside a roman headline for "flair" | Commit to a voice; emphasis from structure |
| Flat hierarchy (h2 barely bigger than body) | ≥1.25× steps on marketing pages |
| Oversized full-sentence H1s | A short, specific headline (≈4–9 words) + a supporting sentence |
| Monospace used as a "techy" costume | Mono only for code, data, figures, IDs |

### Layout and components
| Tell | Better default |
|---|---|
| Centered hero → 3 icon-tile cards → logo strip → testimonial grid → 3 pricing cards → email capture | Structure from the visitor's job (`layout-and-composition.md` §Page anatomy by job) |
| Identical card grids everywhere; one radius + one shadow on every element (the default shadcn/Tailwind kit) | Vary structure by content: lists, tables, split rows, a single feature, editorial columns. Use a small radius scale chosen on purpose (bento is low-signal; fine when the content is truly modular) |
| No imagery: sections that are just cards with icons | Real photos, product screenshots, authored visuals (~30–50% of a Persuade page) |
| "A · B · C" middle-dot meta strings, "WORD — fragment" labels, → appended to every button/link | Plain labels; arrows only where they mean navigation |
| Rounded-square icon tile above each card heading | Icon inline with the label, or no icon; real imagery for features |
| Cards inside cards; every section in a rounded container | Space and alignment group content; containers only when they mean "separate object" |
| Thick colored left-border on rounded cards/callouts | Square callouts with a background tint, or no stripe |
| Hairline border + wide soft shadow on every card ("ghost card") | One depth strategy: border *or* shadow |
| Hero "metric strip" (big numbers, tiny labels) with unsourced stats | Real, sourced numbers only, presented in context |
| Badge pills ("New ✨", "AI-powered", "#1") everywhere | Remove; state facts in copy |
| 01 / 02 / 03 section numbers that carry no sequence | Numbers only when order matters (steps, process) |
| Decorative pulsing status dots, blinking fake cursors, marquees | Live state only; static otherwise |
| Drawn browser windows with traffic-light dots around fake UI | Real screenshots of the real product; a quiet frame is OK around *real* content |
| Emoji as icons; mixed icon families | One icon set, one stroke weight, consistent size |
| Sketchy SVG "illustrations" assembled from shapes; unDraw-style people | Real photography, real product, or none |
| Decorative grid/dot/stripe backgrounds | Only when a real canvas, map or blueprint concept motivates it |

### Motion
| Tell | Better default |
|---|---|
| Fade-up on every section as it scrolls in | At most one authored entrance per page; content visible by default |
| Hover scale-up on every card and image | Feedback on the container (color, border, shadow shift), one signal per element |
| Bounce/elastic easing on UI | Exponential ease-out |
| Parallax on text; infinite loops on persistent UI | Static; loops pause offscreen and under reduced motion |
| Incoherent motion (a card's background scales while its content stays put) | Container and content move as one object |
| Custom cursors, cursor trails | Native cursor |

### Copy
| Tell | Better default |
|---|---|
| Hype words: seamless, unlock, elevate, empower, supercharge, revolutionize, cutting-edge, next-generation, world-class, robust, delve, tapestry, game-changer | Concrete nouns and verbs from the business: what, for whom, where, how much, how fast |
| "Whether you're A or B…", "X. Reimagined.", two-fragment headlines ("Fast. Simple."), rebuttal cadence ("Not X. Y.") repeated | One clear claim per heading, with a supporting fact |
| Calm-virtue words as the replacement (honest, quiet, genuinely, crafted, thoughtfully) | A fact |
| Stock CTAs: Get started / Learn more / Book a demo as second button | Verb + object: "Book a bay", "Get a fleet quote", "See pricing" |
| Invented specifics ("Batch No. 047", "Trusted by 10,000+") | Real data or nothing |
| Default persona names and placeholder brands in demos | Plausible, clearly-sample data labeled as such |

**Over-correction warning:** every ban breeds a substitute. "No em dashes" breeds comma splices. "No hype" breeds virtue words. "No eyebrows" breeds tiny captions doing the same job. The fix is always **a fact**, not a different decoration. Em dashes are fine in moderation; flag only when they become a cadence (roughly more than one per paragraph across a page).

## 3. What to do instead (positive moves)

1. **Lead with a real artifact:** product screenshot, photo of the actual place/team/work, the real menu, a working calculator, a map, a spec sheet.
2. **Make one structural decision the competitor wouldn't:** an editorial split, a full-bleed photographic band, a sticky spec column, a timeline, a big typographic index, a table where others use cards.
3. **Let type carry hierarchy:** size contrast, weight contrast, measure, and whitespace before adding boxes.
4. **Commit color at region scale:** one section drenched in the brand color beats twenty accent sprinkles.
5. **Vary rhythm deliberately:** alternate dense and open sections; vary section heights by content, not by template.
6. **Authored details:** themed text selection, focus rings in the brand color, tabular numerals, proper quotes and apostrophes, balanced headings, real favicons, a considered 404 page. These are the cheapest signals that a page was *built*, not assembled.

## 4. Detection workflow

1. Run `node ${CLAUDE_SKILL_DIR}/scripts/slopscan.mjs <files or dir>` for a mechanical first pass (static HTML/CSS/JSX). It is advisory: judge each finding.
   - Its **vibe score** weights tells by the data above. Mark a deliberate choice with an `edd-ignore` comment on that line; it is counted as a waiver.
   - The scanner can't see layout coherence, spacing rhythm or overflow. Those still need your eyes on the screenshots.
2. **Do your own visual judgment before reading the scan output**, so the tool doesn't anchor you. Look at the screenshots and write down your impression first.
3. Walk `checklists/anti-ai-design-audit.md`.
4. For each finding, decide: **remove**, **replace with a better default**, or **keep with a stated reason**. Record kept items as waivers ("Kept the dark hero: the scene is night-shift operations"). If more than ~5 waivers accumulate, the defaults may *be* this brand's style: document them in DESIGN.md instead.

## 5. Redesigning AI-generated sites without destroying them

Triage first:
- **Heavy slop:** a full direction and the full pass sequence (`workflows/design-refinement.md`).
- **Light slop:** a polish pass. Keep brand, palette and layout; fix tells; put bigger ideas in the report as suggestions.
- **No real slop:** say so. Offer 2–3 specific refinements with exact values and apply them only on agreement. Never change a good screen just to make it different.

Always preserve: content, links, forms, integrations, SEO headings/meta, analytics hooks, accessibility features that already work, and any distinctive element that is genuinely good (a strong photo, a well-chosen color). Record what was kept and why.
