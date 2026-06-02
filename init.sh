#!/bin/bash
# ============================================================
# init.sh — personalizes this template for a new project
# Run once after cloning, before opening in the dev container
# ============================================================
set -e

# ---- colors ----
BOLD="\033[1m"
CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}${CYAN}Next.js Template — Project Setup${RESET}"
echo -e "────────────────────────────────────────"
echo "This will personalize the template files for your project."
echo "Press Ctrl+C at any time to cancel."
echo ""

# ---- helpers ----
prompt() {
  local label="$1"
  local default="$2"
  local result
  if [ -n "$default" ]; then
    read -rp "$(echo -e "${BOLD}${label}${RESET} (default: ${YELLOW}${default}${RESET}): ")" result
    echo "${result:-$default}"
  else
    read -rp "$(echo -e "${BOLD}${label}${RESET}: ")" result
    echo "$result"
  fi
}

# Converts "My Cool App" → "my-cool-app"
to_slug() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

# ---- gather input ----
echo -e "${CYAN}Project details:${RESET}"
echo ""

APP_NAME=$(prompt "App name (shown in browser tab & headings)" "My App")
APP_SLUG=$(to_slug "$APP_NAME")
APP_DESCRIPTION=$(prompt "Short description" "Built with Next.js, TypeScript, Tailwind CSS, and Supabase")
GITHUB_USERNAME=$(prompt "GitHub username" "your-username")
REPO_NAME=$(prompt "GitHub repo name" "$APP_SLUG")

echo ""
echo -e "${CYAN}Confirm the following:${RESET}"
echo -e "  App name:        ${BOLD}${APP_NAME}${RESET}"
echo -e "  Package slug:    ${BOLD}${APP_SLUG}${RESET}"
echo -e "  Description:     ${BOLD}${APP_DESCRIPTION}${RESET}"
echo -e "  GitHub repo:     ${BOLD}github.com/${GITHUB_USERNAME}/${REPO_NAME}${RESET}"
echo -e "  Volume name:     ${BOLD}${APP_SLUG}-node-modules${RESET}"
echo ""
read -rp "$(echo -e "${BOLD}Looks good? [Y/n]:${RESET} ")" confirm
confirm="${confirm:-Y}"
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "Updating files..."

# ---- package.json ----
sed -i.bak "s/\"name\": \"nextjs-starter\"/\"name\": \"${APP_SLUG}\"/" package.json
sed -i.bak "s/\"description\": \".*\"/\"description\": \"${APP_DESCRIPTION}\"/" package.json
echo -e "  ${GREEN}✓${RESET} package.json"

# ---- src/app/layout.tsx ----
sed -i.bak "s/default: \"My App\"/default: \"${APP_NAME}\"/" src/app/layout.tsx
sed -i.bak "s/template: \"%s | My App\"/template: \"%s | ${APP_NAME}\"/" src/app/layout.tsx
sed -i.bak "s/description: \"Built with Next\.js, TypeScript, Tailwind CSS, and Supabase\"/description: \"${APP_DESCRIPTION}\"/" src/app/layout.tsx
echo -e "  ${GREEN}✓${RESET} src/app/layout.tsx"

# ---- src/app/page.tsx ----
sed -i.bak "s|<h1 className=\"mb-4 text-4xl font-bold tracking-tight\">.*</h1>|<h1 className=\"mb-4 text-4xl font-bold tracking-tight\">${APP_NAME}</h1>|" src/app/page.tsx
echo -e "  ${GREEN}✓${RESET} src/app/page.tsx"

# ---- supabase/config.toml ----
sed -i.bak "s/project_id = \"nextjs-starter\"/project_id = \"${APP_SLUG}\"/" supabase/config.toml
echo -e "  ${GREEN}✓${RESET} supabase/config.toml"

# ---- .devcontainer/devcontainer.json ----
sed -i.bak "s/\"name\": \"Next\.js Dev Container\"/\"name\": \"${APP_NAME} — Next.js Dev Container\"/" .devcontainer/devcontainer.json
sed -i.bak "s/nextjs-starter-node-modules/${APP_SLUG}-node-modules/" .devcontainer/devcontainer.json
echo -e "  ${GREEN}✓${RESET} .devcontainer/devcontainer.json"

# ---- README.md ----
sed -i.bak "s|# Next.js Starter Template|# ${APP_NAME}|" README.md
sed -i.bak "s|A production-ready Next.js template.*|${APP_DESCRIPTION}|" README.md
sed -i.bak "s|https://github.com/your-username/nextjs-starter.git|https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git|" README.md
sed -i.bak "s|cd my-app|cd ${REPO_NAME}|" README.md
echo -e "  ${GREEN}✓${RESET} README.md"

# ---- CLAUDE.md ----
sed -i.bak "s|# Project Context for Claude Code|# ${APP_NAME} — Project Context for Claude Code|" CLAUDE.md
echo -e "  ${GREEN}✓${RESET} CLAUDE.md"

# ---- clean up sed backups ----
find . -name "*.bak" -not -path "./node_modules/*" -delete

# ---- generate cspell.json ----
CSPELL_WORDS=$(node -e "
  const raw = '${APP_NAME} ${REPO_NAME} ${APP_SLUG}';
  const projectWords = raw.toLowerCase().split(/[-_ ]+/).filter(Boolean);
  const baseWords = [
    'aarch', 'bookworm', 'clsx', 'cva', 'devcontainer',
    'eacces', 'hookspath', 'jsdom', 'middlewares', 'nextjs',
    'realtime', 'supabase', 'tailwindcss', 'tsconfig', 'upsert', 'vitest'
  ];
  const all = [...new Set([...baseWords, ...projectWords])].sort();
  console.log(JSON.stringify(all, null, 4));
")

cat > cspell.json << CSPELL
{
  "version": "0.2",
  "language": "en",
  "words": $CSPELL_WORDS,
  "ignorePaths": [
    "node_modules",
    ".next",
    "package-lock.json",
    "supabase/migrations"
  ]
}
CSPELL
echo -e "  ${GREEN}✓${RESET} cspell.json"

echo ""
echo -e "${GREEN}${BOLD}All done!${RESET} Your project is ready."
echo ""
echo "Next steps:"
echo "  1. Open this folder in VS Code"
echo "  2. Click \"Reopen in Container\" when prompted"
echo "  3. Fill in your Supabase credentials in .env.local"
echo "  4. Run: npm run dev"
echo ""

# ---- remove this script (one-time setup) ----
rm -- "$0"