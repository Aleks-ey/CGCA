# Reformatter Instructions

You are operating as a systematic code migrator. Your job is to take the
source website in `reformatter/source/` and produce output in `src/`
following this repo's conventions (defined in the root CLAUDE.md, already
loaded into your context).

Do not write any output code until Phase 1 analysis is complete and the
user has confirmed your migration plan.

---

## Phase 1 — Analyse the Source Website

### 1.1 Identify the source stack

Read `reformatter/source/package.json` (and any lock files) and answer:

- Framework (CRA, Vite+React, Next.js pages, Remix, SvelteKit, plain HTML, etc.)
- Styling (CSS Modules, styled-components, Sass, plain CSS, Tailwind v2/v3)
- State management (Redux, Zustand, Context, React Query, SWR, none)
- Routing (react-router, Next.js pages, Next.js app, Tanstack Router, none)
- Auth (Supabase, Firebase, Auth0, Clerk, NextAuth, custom JWT, none)
- Data layer (REST, GraphQL, Supabase, Prisma, tRPC, none)

### 1.2 Map routing structure

List every route: URL path, file that renders it, public vs. protected,
data fetched and from where, URL parameters or query strings used.

### 1.3 Inventory components

Walk the source and classify each component:

- **Primitive/UI atom** — button, input, badge, spinner, modal
- **Layout** — header, footer, sidebar, nav, page wrapper
- **Feature/composite** — domain-specific composites (e.g. ProductCard, CommentThread)
- **Page** — top-level route component

Note for each: uses client-side state? fetches data? requires auth context?

### 1.4 Understand the styling system

- CSS variables / design tokens defined
- Brand colours, type scale, spacing scale, border radii
- Component library in use (MUI, Chakra, Radix, shadcn/ui, Headless UI)?
- Global styles to preserve vs. replace

### 1.5 Understand data and auth

- Database schema inferable from code (tables, columns, relationships)
- API calls made (endpoint signatures)
- Auth pattern and user properties used throughout the app
- Environment variables required

### 1.6 Inventory static assets

List images, icons, fonts — local files vs. CDN URLs.

### 1.7 Write and confirm a migration plan

Before writing any output file, produce a written plan listing:

1. Routes → `src/app/` path mappings
2. Components → `src/components/` placement
3. New DB tables/columns needed (if any)
4. Design tokens to add to `src/styles/globals.css`
5. Environment variables the user must add to `.env.local`
6. Anything intentionally NOT migrated (out of scope)

**Get explicit user confirmation before starting Phase 2.**

---

## Phase 2 — Migrate in Order

Complete each step fully before starting the next. After each step, list
what you created or changed.

### Step 1 — Design tokens

Add brand colours and custom tokens to `src/styles/globals.css` inside
the `@theme` block as CSS custom properties. Never hardcode hex values in
component classes — always reference `var(--token-name)`. Add dark-mode
overrides for every new token inside the existing
`@media (prefers-color-scheme: dark)` block.

### Step 2 — Supabase schema (if needed)

If the source uses a database:

1. Create a migration with `npm run db:migrate -- <name>` and write the SQL.
2. Enable RLS on every new table.
3. Add seed data to `supabase/seed.sql` if appropriate.
4. Remind the user to run `npm run db:generate` after applying migrations.

If source uses a different auth provider (Firebase, Auth0, Clerk), map
user fields to Supabase's `auth.users` + a `profiles` table pattern.

### Step 3 — Primitive UI components → `src/components/ui/`

- `.tsx` extension on every file
- `"use client"` only when the component itself uses hooks, events, or browser APIs
- CVA for multi-variant components — model on existing `src/components/ui/button.tsx`
- `cn()` from `@/lib/utils` for all class merging — no template-literal concatenation
- Replace all CSS Modules / styled-components / Sass with Tailwind utility classes
- Replace colour literals with CSS variables
- Preserve all ARIA attributes and keyboard-accessible behaviour exactly
- Named exports (not default) from component files

### Step 4 — Layout components → `src/components/layout/`

Same rules as Step 3, plus:

- Internal links → `<Link>` from `next/link`
- External links → `<a target="_blank" rel="noopener noreferrer">`
- Active-link state → `usePathname()` from `next/navigation` (requires `"use client"`)
- Images → `<Image>` from `next/image` with explicit `width` and `height`

### Step 5 — App Router pages → `src/app/`

Route mapping:

| Source pattern              | Target pattern                         |
| --------------------------- | -------------------------------------- |
| `/about`                    | `src/app/about/page.tsx`               |
| `/blog/:slug`               | `src/app/blog/[slug]/page.tsx`         |
| Protected route             | page + middleware condition            |
| Shared layout for a section | `src/app/<section>/layout.tsx`         |
| 404                         | `src/app/not-found.tsx`                |
| Error boundary              | `src/app/error.tsx`                    |
| Loading skeleton            | `src/app/loading.tsx` (or per-segment) |

- Default to Server Components; add `"use client"` only when required by that file
- Data fetching in Server Components via `createClient()` from `@/lib/supabase/server`
- Export `generateMetadata()` for pages with distinct titles or descriptions
- Export `generateStaticParams()` for dynamic routes with known value sets

### Step 6 — Authentication (if present)

- Replace source auth provider with Supabase Auth entirely
- Protected routes: add path conditions to `src/middleware.ts`
- Server Components needing current user: `createClient()` from `@/lib/supabase/server` → `supabase.auth.getUser()`
- Client Components: `useUser()` hook from `@/hooks/use-user`
- Auth actions (sign-in, sign-up, sign-out): Server Actions in colocated `actions.ts` files
- Never expose the service-role key to client code

### Step 7 — Feature components and data hooks

- Feature-specific composites → `src/components/<feature-name>/`
- Client hooks wrapping Supabase queries → `src/hooks/use-<entity>.ts`
- Server-side data access → plain `async function` in a `lib/` or colocated `data.ts` file

### Step 8 — Static assets

- Images → `public/images/`
- Fonts → `public/fonts/` + `@font-face` in `globals.css` (skip if using `next/font`)
- Icons → prefer inline SVG components in `src/components/ui/icons/`
- Remove assets already covered by the target stack

### Step 9 — Tests

For every UI component created in Steps 3–4, write a test file following
the pattern in `src/test/button.test.tsx`. Minimum coverage:

- One render test
- One interaction test per interactive component
- One accessibility check (role/label present)
- Mock Supabase: `vi.mock("@/lib/supabase/client")`

---

## Phase 3 — Quality Gate

Do not consider the migration finished until every item passes.

### TypeScript

- [ ] `npm run type-check` exits clean
- [ ] No `any` — use `unknown` + narrowing
- [ ] Supabase query results typed via `Database` from `src/types/supabase.ts`
- [ ] Type imports use `import type { ... }`

### Linting and formatting

- [ ] `npm run lint` exits clean
- [ ] `npm run format:check` exits clean (run `npm run format` to fix)

### Build

- [ ] `npm run build` succeeds

### Runtime

- [ ] All routes render without console errors
- [ ] Auth flow works end-to-end with local Supabase stack
- [ ] Dark mode: all new tokens have dark-mode overrides

### Tests

- [ ] `npm test` passes with zero failures

---

## Hard Rules

Never violate these regardless of how the source code was structured.

1. Never copy secrets from source code into output files — note them in your response and add placeholder names to `.env.local` comments
2. Never use `any` — use `unknown` and narrow
3. Never use `<img>` for local images — use `<Image>` from `next/image`
4. Never use `<a>` for internal navigation — use `<Link>` from `next/link`
5. Never use inline `style={{ ... }}` — use Tailwind; dynamic values via CSS custom properties set inline and referenced as `var(--name)` in a class
6. Never hardcode colours — reference a CSS variable defined in `@theme`
7. Always preserve and improve accessibility markup (never remove `role`, `aria-*`, or `tabIndex`)
8. `cn()` for all class merging
9. Server Components by default; `"use client"` only when required by the specific file
10. Write output into `src/` only — never modify anything in `reformatter/source/`

---

## Handling Ambiguous Cases

- **Inconsistent design in source** → apply the target design system's closest equivalent; note the discrepancy
- **Third-party component library with no Tailwind equivalent** → build from scratch with Tailwind + CVA; document what you built
- **Untyped API response** → infer the type from usage, define an explicit TypeScript interface, mark with `// TODO: verify against real API response`
- **Anything requiring a product decision** → stop and ask the user before proceeding
- **Multiple conflicting source patterns** → pick the most common one, apply it consistently, note the decision
