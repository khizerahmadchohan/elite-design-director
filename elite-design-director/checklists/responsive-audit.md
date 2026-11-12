# Responsive Audit

Capture with `scripts/shoot.mjs` at 320, 390, 768, 1024, 1280, 1440, 1920 (+ landscape 844×390 for heroes/nav). Inspect every image.

- [ ] No horizontal scroll at any width (check 320 especially).
- [ ] First viewport at 390×844 and 1280×800: headline, value line and primary CTA visible.
- [ ] Headlines don't break into one-word lines or overflow; no stranded single words in key headings.
- [ ] Body text ≥16px on mobile; measure within 35–75ch.
- [ ] Navigation works at every stage; mobile menu reachable, labeled, Esc-closable, focus-managed.
- [ ] Touch targets ≥44px with spacing on mobile; no hover-only functions.
- [ ] Sticky headers/CTAs/cookie bars don't cover content or focused elements; safe areas respected.
- [ ] Images: correct art-directed crops; text-on-image legible at every width; no stretched or upscaled photos; correct `sizes`.
- [ ] Grids collapse sensibly; card rows keep consistent ratios; no orphan single card on its own row unless intended.
- [ ] Tables usable on mobile (stacked or scrollable with affordance).
- [ ] Forms single column on mobile, correct keyboard types, labels visible.
- [ ] Section spacing scaled down; no giant dead bands; no cramped edges (≥16px gutters).
- [ ] Wide screens: container capped; lines don't exceed the measure; full-bleed bands intentional.
- [ ] Content order on mobile puts the important things first; DOM order logical.
- [ ] Elementor: per-breakpoint settings used; no duplicated hidden sections; custom breakpoints checked.
- [ ] Real-device check done, or explicitly noted as not done.
