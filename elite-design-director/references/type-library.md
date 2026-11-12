# Type Library
Purpose: curated, real faces grouped by voice, with sources, licenses and saturation risk, so type is chosen rather than defaulted.

Contents: §1 How to use · §2 Library by voice · §3 Pairing recipes · §4 App UI rules · §5 Rotation rule · §6 Loading and performance

## §1 How to use
- Pick the **voice** first (from the Spec, `design-generation.md` §2), then a face inside it.
- Saturation risk = how often the face appears in AI/template output. High is allowed only with a stated reason.
- Sources: GF = Google Fonts (all OFL unless noted); FS = Fontshare (free under the Fontshare/ITF free font license, including commercial use; check current terms); Comm = commercial license.
- "verify" = confirm availability/license on the source before shipping.
- Inter, Geist and Roboto remain fine for Operate UI; they are a tell mainly on Persuade surfaces.

## §2 Library by voice

### Condensed grotesque — loud, industrial, sports, signage
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Archivo / Archivo Narrow | GF | OFL | Sturdy, newsy | Headlines, data labels | Low |
| Barlow Condensed | GF | OFL | Road-sign, utilitarian | Trades, logistics display | Med |
| Big Shoulders | GF | OFL | Civic, Chicago signage | Big display, events | Low |
| Oswald | GF | OFL | Generic poster | Only with reason | High |
| Tanker | FS | FS free | Heavy, stencil-ish | Posters, merch-led brands | Low |

### Neo-grotesk — neutral, confident, Swiss
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Public Sans | GF | OFL | Civic, plain | Government, nonprofits, UI | Low |
| Hanken Grotesk | GF | OFL | Clean, warm-neutral | Text + UI | Low |
| Schibsted Grotesk | GF | OFL | Newsroom | Editorial sites, media | Low |
| Familjen Grotesk | GF | OFL | Quirky grotesk | Display with character | Low |
| Switzer | FS | FS free | Swiss neutral | Text + UI | Low |
| Supreme | FS | FS free | Tight, modern | Display + UI | Low |
| General Sans | FS | FS free | Crisp, contemporary | Display + text | Med |
| Satoshi | FS | FS free | Modernist-geometric | Startups (overused) | Med-High |

### Humanist sans — friendly, readable, human
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Onest | GF | OFL | Open, friendly | Text, local services | Low |
| Albert Sans | GF | OFL | Nordic, soft-geometric | Text + headings | Low |
| Figtree | GF | OFL | Friendly, clear | Text + UI | Med |
| Author | FS | FS free | Bookish humanist | Long text, publishers | Low |

### Geometric sans — modern, structured
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Manrope | GF | OFL | Techy-geometric | UI, fintech | Med |
| Sora | GF | OFL | Wide, futurist | Display, crypto/tech | Med |
| Epilogue | GF | OFL | Eccentric geometric | Display with personality | Low |
| Cabinet Grotesk | FS | FS free | Bold, variable personality | Display | Med |
| Chillax | FS | FS free | Rounded, playful | Lifestyle display | Low |
| Clash Display | FS | FS free | Sharp display | Only with reason | High |

### Contemporary display — personality-led
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Bricolage Grotesque | GF | OFL | Inky, optical-size quirk | Display | Med-High |
| Young Serif | GF | OFL | Chunky, retro-warm | Food, crafts display | Low |
| Ranade | FS | FS free | Calligraphic sans | Cultural, arts | Low |

### Slab — sturdy, workmanlike
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Zilla Slab | GF | OFL | Bold, editorial slab | Headlines, trades | Low |
| Bitter | GF | OFL | Screen-sturdy | Text + headings | Med |
| Roboto Slab | GF | Apache 2.0 | Default slab | Only with reason | High |

### Transitional / old-style serif text — reading, authority
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Literata | GF | OFL | E-book, warm | Long reading | Low |
| Source Serif 4 | GF | OFL | Neutral, opsz axis | Text + display | Med |
| Spectral | GF | OFL | Elegant screen serif | Essays, reports | Low |
| Crimson Pro | GF | OFL | Old-style, literary | Books, culture | Low |
| EB Garamond | GF | OFL | Classical | Heritage, academic | Med |
| Libre Caslon Text / Display | GF | OFL | Colonial, legal | Law, heritage | Low |
| Gelasio | GF | OFL | Georgia-metric | Text, fallback-safe | Low |
| Alegreya | GF | OFL | Calligraphic, lively | Literature, culture | Low |
| Newsreader | GF | OFL | Newspaper | Only with reason | High |

### Display serif — voice-forward headlines
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| Erode | FS | FS free | Sharp, modern serif | Headlines | Low |
| Sentient | FS | FS free | Soft, literary | Headlines + text | Low |
| Zodiak | FS | FS free | High-contrast | Fashion, culture display | Low |
| Gambetta | FS | FS free | Robust text/display | Editorial | Low |
| Boska | FS | FS free | Expressive italic-led | Display | Low |
| Fraunces | GF | OFL | Soft "wonky" serif | Only with reason | High |
| Instrument Serif | GF | OFL | Condensed editorial | Only with reason | High |
| DM Serif Display | GF | OFL | Generic elegance | Only with reason | High |
| Playfair Display | GF | OFL | Template luxury | Only with reason | High |

### Mono — code, data, labels
| Face | Source | License | Voice | Best use | Sat. |
|---|---|---|---|---|---|
| JetBrains Mono | GF | OFL | Developer, clear | Code, data | Med |
| IBM Plex Mono | GF | OFL | Corporate-technical | Labels, data | Med |
| Martian Mono | GF | OFL | Wide, techy | Display labels | Low |
| Commit Mono | commitmono.com / GitHub (verify) | OFL (verify) | Neutral coder | Code | Low |
| Space Mono | GF | OFL | Retro-tech | Only with reason | High |

### Variable workhorses for app UI (Operate)
| Face | Source | License | Note |
|---|---|---|---|
| Inter | GF | OFL | Safe default; tabular figures, wide language |
| Geist / Geist Mono | GF (added 2024) / Vercel | OFL | Dev-tool feel |
| Roboto Flex | GF | OFL | Many axes; Android-native feel |
| IBM Plex Sans | GF | OFL | Enterprise, pairs with Plex Mono |
| Public Sans | GF | OFL | Neutral alternative to Inter |

## §3 Pairing recipes
Pair on **one** contrast axis, keep others close.

| Axis | Contrast | Rule |
|---|---|---|
| Structure | Serif vs sans | Match x-height and era feel |
| Width | Condensed vs normal | Condensed display, normal text |
| Weight | Heavy display vs light/regular text | Same family is fine |
| Era | Historic vs contemporary | One is the voice, one recedes |

**These are worked examples of the axis method, not a menu.** Re-tests showed that a pairing listed next to an industry gets copied for that industry, so this table has no industry column. Rules:
1. **Never adopt a listed pair whole.** Derive your own from the brand's world (`design-generation.md` §3). At most one face may come from this table.
2. A listed pair counts as a default in the same-prompt test.
3. Check `history/log.jsonl` so you don't reuse the last projects' faces.

| Display | Text | Axis | Voice quality |
|---|---|---|---|
| Big Shoulders | Public Sans | Width | Loud, public, signage-like |
| Archivo Narrow | Literata | Width + structure | Dense, documentary |
| Zilla Slab | Hanken Grotesk | Structure | Sturdy, mechanical |
| Erode | Switzer | Structure | Sharp, precise |
| Libre Caslon Display | Schibsted Grotesk | Era | Historic authority + plain modern text |
| Young Serif | Onest | Era | Warm, handmade |
| Zodiak | Albert Sans | Structure | High-contrast elegance |
| Epilogue 800 | Epilogue 300 | Weight | Single family, bold voice |
| Supreme | Martian Mono (labels) | Structure | Technical, engineered |
| Crimson Pro | Familjen Grotesk | Structure + era | Literary + quirky grotesk |

## §4 App UI rules
- One workhorse family + one mono. No display face inside the app chrome; marketing pages may differ.
- Tabular numerals on for tables, prices, timers.
- 3-4 weights max; 13-16 px body range; test at 1× DPR.

## §5 Rotation rule
- Check `history/log.jsonl` (`design-generation.md` §6) before choosing.
- Don't reuse the same display face in consecutive projects unless the brand already owns it.
- Avoid High-saturation faces in two consecutive projects at all.

## §6 Loading and performance
- Load only weights/styles actually used; prefer one variable file over 4 statics.
- Subset (`unicode-range` / `&text=` / glyphhanger) to needed languages.
- Self-host WOFF2; `font-display: swap`; preload the one display file above the fold.
- Metric-matched fallback (`size-adjust`, `ascent-override`) to cut layout shift.
- Fontshare and commercial faces: keep license text with the project; check webfont/self-host rights.
