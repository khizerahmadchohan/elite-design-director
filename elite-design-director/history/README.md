# history/

Purpose: cross-project memory so successive projects don't converge on the same look.

Format: `log.jsonl`, one JSON object per line, appended at handoff:
`{"date","project","surface","display_font","text_font","anchor_hex","strategy","hero_archetype","signature","mode"}`

Read the last ~10 lines at planning (see references/design-generation.md §6).

Privacy: design decisions only. Never store client secrets, credentials, contact data, URLs of private staging sites or unreleased copy. Use a short project nickname.
