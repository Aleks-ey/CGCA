# Project Context for Claude Code

This file is read automatically by Claude Code when you run `claude` in this project.
Update it as your project evolves to give Claude the context it needs.

## Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first config in `src/styles/globals.css`)
- **Backend**: Supabase (auth, database, storage, realtime)
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint 9 flat config + Prettier

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  components/
    ui/          # Reusable primitive components (Button, Input, etc.)
    layout/      # Layout components (Header, Footer, Sidebar)
  hooks/         # Custom React hooks
  lib/
    supabase/    # Supabase clients: client.ts, server.ts, middleware.ts
    utils.ts     # cn() and other utilities
  styles/        # globals.css (Tailwind theme config)
  test/          # Vitest setup and shared test utilities
  types/
    supabase.ts  # Auto-generated Supabase DB types (npm run db:generate)
supabase/
  config.toml    # Local Supabase stack configuration
  migrations/    # SQL migration files
  seed.sql       # Local dev seed data
.devcontainer/   # Docker dev container config with Claude Code
```

## Key Conventions

- **Path alias**: `@/` maps to `src/`
- **Supabase clients**: Use `createClient()` from `@/lib/supabase/server` in Server Components/Actions, `@/lib/supabase/client` (or the `useSupabase()` hook) in Client Components
- **Class merging**: Use the `cn()` utility from `@/lib/utils` for all conditional Tailwind classes
- **Component variants**: Use `class-variance-authority` (CVA) for components with multiple visual variants
- **Types**: Always regenerate `src/types/supabase.ts` after schema changes with `npm run db:generate`

## Common Commands

```bash
npm run dev           # Start dev server (http://localhost:3000)
npm run build         # Production build
npm run type-check    # TypeScript check without emitting
npm run lint          # ESLint
npm run format        # Prettier format all files
npm test              # Run tests (watch mode)
npm run db:start      # Start local Supabase stack
npm run db:generate   # Regenerate Supabase TypeScript types
npm run db:migrate    # Create a new migration file
npm run db:reset      # Reset local DB and re-run all migrations + seed
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.
Never commit `.env.local` to git.

## Testing Guidelines

- Place test files in `src/test/` or colocate as `*.test.tsx` next to the component
- Mock Supabase calls in tests — never hit the real database
- Use `@testing-library/react` for component tests; prefer user-centric queries (`getByRole`, `getByLabelText`)
