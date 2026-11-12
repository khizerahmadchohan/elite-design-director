#!/usr/bin/env sh
# Installs the ELITE DESIGN DIRECTOR skill for Claude Code (macOS/Linux/Git Bash).
set -e
src="$(cd "$(dirname "$0")" && pwd)/elite-design-director"
dest="$HOME/.claude/skills/elite-design-director"
[ -f "$src/SKILL.md" ] || { echo "SKILL.md not found in $src"; exit 1; }
mkdir -p "$HOME/.claude/skills"
if [ -e "$dest" ]; then b="$dest.backup-$(date +%Y%m%d-%H%M%S)"; mv "$dest" "$b"; echo "Existing skill backed up to: $b"; fi
cp -R "$src" "$dest"
echo "Installed to: $dest. Restart Claude Code, then use: /elite-design-director"
