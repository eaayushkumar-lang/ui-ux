#!/usr/bin/env bash
# Installs project dependencies (framer-motion, playwright) and all Claude
# skills used by this repo (ui-ux-pro-max, emil-design-eng, impeccable-lite,
# design-taste-frontend, design-taste-frontend-v1, stitch-design-taste).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

echo "==> Installing npm dependencies (framer-motion, playwright)"
npm install framer-motion playwright

echo "==> Installing skills from emilkowalski/skill (animate, apple-design, ask-sonner, emil-design-eng, ...)"
npx skills add emilkowalski/skill

echo "==> Installing skills from ilindaniel/impeccable-lite"
npx skills add ilindaniel/impeccable-lite

echo "==> Installing skills from Leonxlnx/taste-skill (design-taste-frontend, design-taste-frontend-v1, stitch-design-taste, ...)"
npx skills add Leonxlnx/taste-skill

if [ -d .claude/skills/ui-ux-pro-max ]; then
  echo "==> ui-ux-pro-max already present in .claude/skills (checked into repo, no install needed)"
else
  echo "!! ui-ux-pro-max not found in .claude/skills — it is expected to already be committed to this repo."
  exit 1
fi

echo "==> Done. Installed skills:"
ls .claude/skills
