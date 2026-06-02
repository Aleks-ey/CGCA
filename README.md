# Next.js Starter Template

A production-ready Next.js template with TypeScript, Tailwind CSS v4, Supabase, and a Docker dev container pre-configured with Claude Code.

## What's Included

| Feature             | Details                                                            |
| ------------------- | ------------------------------------------------------------------ |
| **Next.js 15**      | App Router, Turbopack, typed routes                                |
| **TypeScript**      | Strict mode, path aliases (`@/`)                                   |
| **Tailwind CSS v4** | CSS-first theme config, `cn()` utility                             |
| **Supabase**        | Browser + server + middleware clients, auth hooks, type generation |
| **Dev Container**   | Docker + Claude Code + Supabase CLI + Oh My Zsh                    |
| **Testing**         | Vitest + Testing Library + jsdom                                   |
| **CI**              | GitHub Actions (lint → type-check → test → build)                  |
| **DX**              | ESLint 9, Prettier, git pre-commit hooks, VS Code settings         |

## Getting Started

### Option A — Dev Container (recommended)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and the VS Code [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Clone this repo and `cd` into it
3. **Run the init script** to personalize the template for your project:
   ```bash
   bash init.sh
   ```
4. Open the folder in VS Code —
   If prompted: click **"Reopen in Container"**
   If not prompted: Cmd+Shft+P > Dev Containers: Rebuild and Reopen in Container
5. The container will install dependencies and create `.env.local` automatically
6. Fill in your Supabase credentials in `.env.local`
7. Run `npm run dev`

Claude Code is pre-installed in the container. Just run `claude` in the terminal.

### Option B — Local

```bash
# 1. Clone and personalize
git clone https://github.com/your-username/nextjs-starter.git my-app
cd my-app
bash init.sh

# 2. Install dependencies
npm install

# 3. Need to set pre-commit to run when pushing to git
git config core.hooksPath .githooks

# 4. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

### Cloud (production)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **anon key** from Project Settings → API into `.env.local`
3. Run migrations: `supabase db push`
4. Regenerate types: `npm run db:generate`

### Local (development)

```bash
npm run db:start      # Start local Supabase stack (Docker required)
npm run db:generate   # Generate TypeScript types from your local schema
npm run db:reset      # Reset DB, re-run all migrations, apply seed data
npm run db:migrate    # Create a new migration file
npm run db:stop       # Stop the local stack
```

Local Supabase Studio runs at [http://localhost:54323](http://localhost:54323).

## Project Structure

```
.
├── .devcontainer/         # Docker dev container (Claude Code, Supabase CLI)
├── .github/workflows/     # GitHub Actions CI
├── .githooks/             # pre-commit: lint + type-check + format
├── .vscode/               # Recommended extensions + workspace settings
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/
│   │   ├── ui/            # Primitive components (Button, Input…)
│   │   └── layout/        # Layout components
│   ├── hooks/             # useUser, useSupabase, …
│   ├── lib/
│   │   ├── supabase/      # client.ts · server.ts · middleware.ts
│   │   └── utils.ts       # cn() class merger
│   ├── styles/globals.css # Tailwind v4 theme tokens
│   ├── test/              # Vitest setup + shared helpers
│   └── types/supabase.ts  # Auto-generated DB types
├── supabase/
│   ├── config.toml        # Local stack config
│   ├── migrations/        # SQL migrations
│   └── seed.sql           # Dev seed data
├── CLAUDE.md              # Project context for Claude Code
└── .env.local.example     # Environment variable template
```

## Scripts

```bash
npm run dev           # Next.js dev server with Turbopack
npm run build         # Production build
npm run start         # Start production server
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run type-check    # TypeScript (no emit)
npm run format        # Prettier (write)
npm run format:check  # Prettier (check only)
npm test              # Vitest (watch)
npm run test:ui       # Vitest UI
npm run test:coverage # Coverage report
```

## Customization

- **Theme tokens**: Edit CSS variables in `src/styles/globals.css` under `@theme {}`
- **Supabase schema**: Add SQL files to `supabase/migrations/`, run `npm run db:reset` locally
- **Types**: After any schema change, run `npm run db:generate` to update `src/types/supabase.ts`
- **Route protection**: Edit `src/middleware.ts` to add/remove protected routes
- **Dev container**: Edit `.devcontainer/devcontainer.json` to add VS Code extensions or features

## Using Claude Code

```bash
# Inside the dev container (or with Claude Code installed locally):
claude                                    # Interactive mode
claude "add a login page with Supabase"   # One-shot task
claude --dangerously-skip-permissions     # Unattended mode (safe inside container)
```

The `CLAUDE.md` file at the root gives Claude Code context about your project structure and conventions. Keep it updated as your project grows.

## License

MIT
