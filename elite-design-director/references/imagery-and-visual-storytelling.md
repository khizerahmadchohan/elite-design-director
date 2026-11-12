# Imagery and Visual Storytelling
Contents: 1. Source priority · 2. Art direction · 3. Text on images · 4. Treatments · 5. Captions and credits · 6. Icons and illustration · 7. Technical delivery · 8. Visual storytelling  _(read only the section you need)_

Images are evidence. One decisive real photograph beats five mediocre ones. A page about a physical business must show that business.

## 1. Source priority
1. **The client's own photos and assets** (ask for them; they matter more than anything else).
2. **Real product captures:** screenshots of the actual software at 2× (desktop 1440×900, mobile 390×844), uncropped and unretouched apart from sample data.
3. **The product built in code:** a live HTML/CSS rendition of the real UI with plausible, clearly-sample data, when the product can't be captured.
4. **Openly licensed stand-ins:** Wikimedia Commons (CC0/PD/CC-BY/CC-BY-SA, with credit) or the client's licensed stock. Prefer *detail* shots (hands, tools, materials, process) over fake "hero" scenes. Never present stand-ins as the client's own premises, staff, customers or products. Log every stand-in in the handoff for replacement. Check each stock provider's current license terms before use; some restrict automated selection or certain uses.
5. **Generated imagery:** only with the user's explicit consent, disclosed, and never as a depiction of a real place, person or product the client sells. It suits abstract or world scenes for software with no physical subject. Ask before spending money on a paid generator.
6. **Typography as image:** a strong typographic composition beats a weak photo.

**When no images exist yet (placeholder slots):** design the slot as part of the composition, at the final aspect ratio and size. Give it a quiet tinted surface from the palette and a small caption-style label naming the intended shot ("Photo: bay 3 at dusk, wide, crew in frame"), and the same alt text. Never use gray boxes with an X, stock watermarks or random images. List every slot in the handoff as the top improvement lever. Judge the composition assuming the photo will be strong, and say so in the scorecard.

Never hotlink image URLs from memory. Never use identifiable other businesses or people presented as staff or customers. Watch out for loaded symbols (historical flags, insignia) used as decoration.

## 2. Art direction
Write an image brief per page: subject, setting, light (time of day, quality), lens and distance, palette relationship to the page, mood, and what is never shown. Keep one light and one grade across a page so the images read as one shoot.
- **Big or not at all:** feature images span ≥ half the grid or full-bleed. Thumbnail-sized decorative photos read as filler.
- **Show use, not poses:** the product in context, hands at work, the real space during operation.
- **Category clichés to avoid:** handshake, headset-smiling-agent, laptop-on-desk from above, latte art, thrown flour, glossy CGI car on black, generic skyline.
- **Product pages:** multiple angles, scale reference, detail crops, consistent background, zoom.
- **People:** real team photos > none > stock. Diversity should come from reality, not tokenism.

**Photo brief / shot list** (give it to the client or photographer):
```
Shot | Subject & action | Setting | Light (time, quality) | Lens/distance | Crop ratio(s) incl. mobile | Calm area for text (where) | Must avoid
```
Plan 1 hero shot, 2–4 detail or process shots, 1 people/place shot, and product angles where relevant.

**Generated-image prompt template** (only with consent, disclosed, never depicting the client's real place, people or product): subject in one sentence · setting · light and palette (name the page's hex values) · style (one: cinematic photo, editorial still life, soft 3D, print/engraving only if the brand lives in it) · composition (calm side or lower fifth for text) · exclusions (no text, logos, UI, watermarks) · aspect ratio and 2× size. Generate once, adjust the prompt rather than rerolling, and ask before using paid tools.

**No assets?** Compensate so originality isn't capped: designed image slots (above), plus stronger type scale contrast, a committed color field, and a structural signature. See `design-generation.md` §9.

## 3. Text on images
1. **Compose for calm space first:** choose or crop images with a quiet region for text.
2. Provide a separate mobile crop (`<picture>` / art direction) when the desktop calm area disappears at 390px.
3. Only if measured contrast still fails: add a subtle scrim derived from the ink color (gradient from ~35–65% opacity) or place the text in a solid panel.
4. Measure contrast at the worst point behind the text, at every breakpoint.

## 4. Treatments
Leave the client's own product and place photography natural (light color correction only). A duotone or tint treatment can unify mismatched stand-ins or abstract imagery when the direction calls for it; never filter a product the visitor is evaluating. Avoid fake grain, heavy vignettes and Instagram-style grades unless that *is* the brand.

## 5. Captions and credits
Captions are for facts (the dish and its price, the bay and its hours, the project and its result), not for "sample image" notes. Credits for licensed images go in a footer line or credits page with photographer, license and source as required by the license.

## 6. Icons and illustration
- One icon family, one stroke weight (typically 1.5–2px at 20–24px), sized relative to adjacent text, colored with text roles (not rainbow). Inline SVG or a sprite. Use outline *or* filled consistently, filled only for active/selected states.
- Proven families to choose from (pick one per project and record it): Lucide, Phosphor (has weights), Tabler, Heroicons, Material Symbols (variable), Remix Icon, Iconoir. Elementor ships Font Awesome; prefer its SVG/inline mode. Lucide alone is a common default, so pick deliberately.
- Icons label actions or reinforce scanning. They are not a decorative tile above every heading.
- No emoji as structural icons.
- Illustration: commission or use a coherent real illustration system, or don't use illustration. Avoid generic illustration packs and SVG scenes assembled from primitives. Simple geometric diagrams that explain something are fine.
- Real brand logos (partners, integrations, payment methods) only with permission or when factual, using the official assets.

## 7. Technical delivery
- Formats: AVIF/WebP with JPEG fallback at 75–85% quality. SVG for logos and icons.
- `srcset` + `sizes` for responsive resolution. `<picture>` for art-directed crops.
- Explicit `width`/`height` or `aspect-ratio` on every image (no CLS).
- The hero/LCP image gets `fetchpriority="high"` and is *not* lazy-loaded. Everything below the fold uses `loading="lazy"` + `decoding="async"`.
- Budgets: hero ≤ ~300–400KB, others ≤ ~200KB. Total image weight on a landing page ideally ≤ 2MB.
- Video instead of GIF (`muted autoplay loop playsinline`, with a poster frame; paused under reduced motion).

## 8. Visual storytelling
Sequence sections as a narrative: **situation** (who you are and where you are) → **tension** (the problem or desire) → **proof** (real evidence) → **resolution** (how it works, what it costs) → **action**. Each section should earn the next scroll. Use pacing: alternate dense information with breathing visual moments. End on a real close.
