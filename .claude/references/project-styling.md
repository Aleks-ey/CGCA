# Project Styling

> Managed by /project:style-config. Edit manually or re-run the skill to update.

## Color Palette

- **Primary**: Prussian Blue — `var(--color-prussian-blue)` / `#1e293b`
- **Accent / CTA**: Rojo Red — `var(--color-rojo-red)` / `#dc2626`
- **Background**: White — `var(--color-background)` / `#ffffff` (dark: `#0a0a0a`)
- **Muted / Surface**: Peach — `var(--color-peach)` / `#f4dcd3` — use as card/section surface color
- **Destructive**: `var(--color-destructive)` / `#ef4444`
- **Text primary**: `var(--color-foreground)` / `#0a0a0a` (dark: `#ededed`)
- **Text secondary**: `var(--color-muted-foreground)` / `#64748b` (dark: `#94a3b8`)

## Typography

- **Heading font**: Cormorant Garamond — `var(--font-cormorant)` — Tailwind: `[font-family:var(--font-cormorant)]`
- **Body font**: Nunito Sans — `var(--font-nunito)` — Tailwind: `[font-family:var(--font-nunito)]`

> **Migration note**: Existing `.h11` and `.h12` named classes in `globals.css` still reference Merriweather. Update them to `--font-cormorant` when refactoring those components. Do not change them until explicitly asked.

## Spacing & Density

Airy — generous whitespace throughout: `px-8–px-10` section padding, `py-12` hero/CTA blocks, `mt-28–mt-40` between major page sections, `gap-16` card grids.

## Border Radius

Soft — `rounded-lg` on cards and containers, `rounded-md` on buttons and form inputs. Standardize away from the current `rounded-[10px]` magic number to `rounded-lg` when touching those components.

## Dark Mode

Full user toggle — implement with `next-themes`. Wrap `<body>` in a `ThemeProvider`, add a theme toggle button to the header. Use `class` strategy (`dark` class on `<html>`). Replace hardcoded `bg-white` in `layout.tsx` `<main>` with `bg-background` so CSS vars cascade correctly.

## Animation & Motion

Subtle — retain existing `transition-colors` on nav/buttons and the home word-cycle animation. Add `transition-transform duration-200` on interactive cards when touched. Add smooth focus rings via `focus-visible:ring-2 focus-visible:ring-[var(--color-rojo-red)]` on all interactive elements.

## Component Consistency

New components only — do not refactor existing components; enforce the patterns below only for new work.

## Accessibility Baseline

Critical fixes only — priorities:

1. Fix dark mode so it actually works (see Dark Mode section above)
2. Add visible focus rings to all interactive elements (see Animation section above)
3. Skip: skip link, full contrast audit, full ARIA review

## Tailwind Named Classes (generated)

- `.span1`: `bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] bg-black [background-size:200%]` — gradient letter knockout effect used on CGCA initials NOTE: span1 is deprecated.
- `.h11`: `text-4xl font-bold md:text-5xl [font-family:var(--font-merriweather)]` — large Merriweather heading; migrate to `--font-cormorant` when refactoring
- `.h12`: `text-3xl font-bold text-[var(--color-prussian-blue)] [font-family:var(--font-merriweather)]` — medium prussian-blue heading; migrate to `--font-cormorant` when refactoring

## Notes

- This is a Georgian cultural heritage site — warm tones (peach, rojo red) are intentional brand choices, not accidental.
- The `.filter-white` utility in `globals.css` inverts SVG icons to white; use it on social icons placed on dark backgrounds.
- The home word-cycle (`home-word-cycle.tsx`) uses `mix-blend-screen` on a background image — this is an intentional photographic knockout effect, not a contrast bug.
- Footer currently uses `bg-slate-800` / `text-slate-300` raw scale colors instead of tokens. Migrate to `bg-[var(--color-prussian-blue)]` / `text-[var(--color-primary-foreground)]` when touching the footer.
