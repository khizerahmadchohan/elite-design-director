# Elite Design Director

A [Claude Code](https://claude.com/claude-code) skill that works as creative director, product designer and design engineer. It designs websites, landing pages, sections, dashboards and components, and draws logos, SVG illustrations and icon sets. It is built to avoid the generic "AI-made" look, and it checks its own work in a real browser.

## What it does
- **Designs** full sites, landing pages, single sections, dashboards, components and design systems, on any stack: HTML/CSS, React/Next.js, Tailwind, WordPress/Elementor, WooCommerce or Shopify.
- **Improves** existing designs through critique, audit, redesign and polish modes, plus focused modes: `bolder`, `quieter`, `distill`, `harden`, `colorize`, `typeset`, `animate`, `adapt` and `delight`.
- **Vector engine:** logos with a favicon and web-icon kit, hand-authored SVG illustrations, consistent icon sets, and raster-to-SVG tracing.
- **Anti-generic design:** every choice is tied to the brand, a "same-prompt test" catches look-alike plans, and a history log stops the skill from repeating its own house style across projects.
- **Verifies by looking:** headless-browser screenshots at real widths, keyboard and contrast checks, font loading checks, a scanner for generic "AI tells", SVG validation, a calibrated 12-point scorecard and an optional fresh-eyes reviewer.

## Install
Requirements: Claude Code, Node.js 22+, and Chrome or Edge (for the checking scripts). Python 3 with Pillow is needed only for `trace.py`. No npm packages and no paid APIs.

```sh
git clone https://github.com/khizerahmadchohan/elite-design-director.git
cd elite-design-director
./install.sh          # macOS / Linux / Git Bash
.\install.ps1         # Windows PowerShell
```
Or copy the `elite-design-director/` folder to `~/.claude/skills/` yourself. Restart Claude Code afterwards.

## Use
```
/elite-design-director <mode> <what you want>
```
| Goal | Example |
|---|---|
| New site / page | `/elite-design-director landing page for a dental clinic` |
| One section | `/elite-design-director section pricing with 3 plans` |
| Fix an existing design | `/elite-design-director critique https://example.com` |
| Polish | `/elite-design-director polish` (attach a screenshot) |
| Logo | `/elite-design-director logo "Brand Name", what the business does` |
| Illustration / icons | `/elite-design-director illustration office scene for the hero` |
| Raster to SVG | `/elite-design-director trace logo.png` |
| Elementor | `/elite-design-director elementor about page` |

Plain language works too, for example "make this page look less generic".

**Tips:** give it the brand name, audience, any fixed colors or fonts, a reference site you like, and real content. It never invents testimonials, prices or metrics; it marks placeholders instead.

## Safety rules built in
- It never edits or publishes live websites without your explicit permission.
- It never bypasses login walls or CAPTCHAs.
- It uses references for inspiration only and never copies copyrighted designs.
- It never calls paid APIs without your consent.

## Layout
`elite-design-director/` holds `SKILL.md` (entry and routing), `references/`, `workflows/`, `checklists/`, `agents/`, `scripts/` and `research/` (sources and licensing).

## License
MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE). Credits for the ideas adapted from other open-source projects are in `elite-design-director/research/licensing-and-attribution.md`.
