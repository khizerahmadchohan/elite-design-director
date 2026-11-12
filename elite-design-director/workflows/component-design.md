# Workflow: Component Design

For a single component or UI fix. Keep it light: no discovery interview, no direction exercise.

1. **Locate the system.** Find existing tokens, similar components and the component library. The new component inherits the surrounding surface: no new colors, fonts, radii or shadows without asking.
2. **Define the contract** (`references/component-patterns.md` §1): purpose, variants by intent, sizes, all states, content limits, accessibility model (APG pattern, keyboard map, ARIA), responsive behavior (container query if reused at different widths).
2b. **Light research (optional, 3–5 references)** only for visually novel components; skip it for standard controls.
3. **Use native or headless primitives** where they exist (`<dialog>`, `<details>`, Radix/Base UI/React Aria, Elementor native widgets).
4. **Build** with tokens only. Motion per `references/motion-and-interactions.md` (frequency gate first).
5. **Stress it:** long text, empty, error, loading, RTL, 200% zoom, keyboard only, touch, dark mode if supported.
6. **Verify** visually (render the component in context, screenshot at relevant widths) and with the relevant checklist items.
7. **Report:** what was built, states covered, any token added (and why), what wasn't verified.
