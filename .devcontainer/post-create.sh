#!/bin/bash
# ============================================================
# post-create.sh — runs once after the dev container is built
# ============================================================
set -e

echo "Setting up your Next.js dev environment..."

# Copy .env.local.example to .env.local if it doesn't already exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.local.example..."
  cp .env.local.example .env.local
  echo "Don't forget to fill in your Supabase credentials in .env.local"
fi

# Set up git hooks (lint + type-check before commit)
echo "Configuring git hooks..."
git config core.hooksPath .githooks 2>/dev/null || true

if [ -d ".githooks" ]; then
  chmod +x .githooks/*
fi

echo ""
echo "Setup complete! Available commands:"
echo "   npm run dev          → Start Next.js dev server (http://localhost:3000)"
echo "   npm run db:start     → Start local Supabase stack"
echo "   npm run db:generate  → Regenerate Supabase TypeScript types"
echo "   npm run lint         → Run ESLint"
echo "   npm run type-check   → Run TypeScript type checking"
echo "   npm test             → Run Vitest tests"
echo "   claude               → Start Claude Code"
echo ""
