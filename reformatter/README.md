# Reformatter

This folder contains a Claude Code-driven workflow for migrating another
website's codebase into this repo's stack (Next.js 15, TypeScript,
Tailwind v4, Supabase).

## How to use

1. Drop the source website's code into `reformatter/source/`.
   That folder is gitignored — its contents will never be committed.

2. `cd` into `reformatter/` and start Claude Code:

   ```
   cd reformatter && claude
   ```

   Running from inside this folder ensures Claude auto-loads
   `reformatter/CLAUDE.md` along with the root `CLAUDE.md`.

3. Tell Claude: **"Begin the migration of the source website."**
   Claude will analyse the source, confirm its plan with you, then
   migrate it systematically into `src/`.

4. When done, empty `reformatter/source/` to keep the repo clean.

## What gets committed

- `reformatter/CLAUDE.md` — migration instructions (always committed)
- `reformatter/README.md` — this file

## What never gets committed

- Everything inside `reformatter/source/` (gitignored)
