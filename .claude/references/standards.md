# Web Standards Reference

This is the authoritative reference for Phase 3 of the web-polish skill. Read this before making any code changes.

---

## Table of Contents

1. [HTML Semantics](#1-html-semantics)
2. [Accessibility (WCAG 2.1 AA)](#2-accessibility)
3. [Color & Contrast](#3-color--contrast)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Component Patterns](#6-component-patterns)
7. [Performance](#7-performance)
8. [Tailwind 4 Specifics](#8-tailwind-4-specifics)
9. [Next.js Specifics](#9-nextjs-specifics)
10. [Dark Mode](#10-dark-mode)
11. [Animation & Motion](#11-animation--motion)
12. [Forms](#12-forms)
13. [Navigation](#13-navigation)

---

## 1. HTML Semantics

### Use semantic elements

Replace meaningless `<div>` and `<span>` wrappers with the correct element when there is one.

| Context                             | Use instead of div                                          |
| ----------------------------------- | ----------------------------------------------------------- |
| Top-level page chrome               | `<header>`, `<main>`, `<footer>`                            |
| Site nav                            | `<nav aria-label="Main navigation">`                        |
| Standalone content                  | `<article>`                                                 |
| Grouped thematic content            | `<section aria-labelledby="section-heading-id">`            |
| Supplementary content               | `<aside>`                                                   |
| Navigation breadcrumbs / pagination | `<nav aria-label="Breadcrumb">`                             |
| Lists of items (cards, links, tags) | `<ul>` / `<ol>` + `<li>`                                    |
| Data comparisons                    | `<table>` with `<thead>`, `<tbody>`, `<th scope="col/row">` |
| Pull quotes                         | `<blockquote>`                                              |
| Definitions                         | `<dl>`, `<dt>`, `<dd>`                                      |
| Code                                | `<code>`, `<pre><code>`                                     |
| Date/time                           | `<time datetime="2025-06-04">`                              |

### Heading hierarchy

- Every page has exactly **one `<h1>`** — the primary topic of the page, not the site logo.
- Headings descend logically: h1 → h2 → h3. Never skip a level (e.g., h1 → h4).
- Don't use headings just for visual size — use them for document structure. Style with Tailwind if you need a non-semantic size change.

### Button vs link

- `<button>` — triggers an action (open modal, submit, toggle, increment).
- `<a href>` — navigates to a new location (page, anchor, external URL).
- Never use `<div onClick>` or `<span onClick>` for interactive elements. Always use the correct native element.
- Buttons inside forms: set `type="button"` explicitly to avoid accidental form submission.

### Images

- Every `<img>` and Next.js `<Image>` must have an `alt` prop.
- **Decorative images** (pure aesthetics, adds no information): `alt=""`.
- **Informative images**: describe what the image shows concisely. Not "image of..." — just the description.
- **Functional images** (logo that links home, icon inside a button): alt = the action or destination, not the graphic description.
- For complex images (charts, diagrams): provide a longer description via `aria-describedby` pointing to a nearby element.

### lang attribute

`<html lang="en">` must always be set. Use the correct BCP 47 language tag for the site's primary language.

---

## 2. Accessibility

### Keyboard navigation

- All interactive elements (links, buttons, inputs, custom widgets) must be reachable by Tab key.
- All interactive elements must be activatable with Enter (links, buttons) and Space (buttons, checkboxes).
- Focus order must be logical — follows reading order, not DOM quirks from `position: absolute`.
- Never use `tabindex` values greater than 0 (positive tabindex breaks natural order).
- Use `tabindex="0"` to make a non-interactive element focusable only if truly necessary.
- Use `tabindex="-1"` to allow programmatic focus (e.g., setting focus on a modal when it opens) without adding to tab order.

### Visible focus rings

Tailwind removes default focus outlines via preflight. Add them back. Standard pattern:

```tsx
// On all interactive elements
className =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2";
```

Use `focus-visible:` not `focus:` — this shows rings only for keyboard nav, not mouse clicks (better aesthetics without sacrificing accessibility).

### Skip link

Add a skip-to-main-content link as the very first element in `<body>`. It's invisible until focused.

```tsx
// In app/layout.tsx, before everything else in <body>
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:ring-2 focus:ring-black"
>
  Skip to main content
</a>
// Then on your <main> element:
<main id="main-content">
```

### ARIA

**Use ARIA only when native HTML semantics can't do the job.** The first rule of ARIA is: don't use ARIA if you can use a native HTML element.

When you do need ARIA:

| Pattern                               | ARIA usage                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| Icon-only button                      | `<button aria-label="Close dialog">`                                         |
| Icon + visible text button            | No aria-label needed — the text is the label                                 |
| Decorative icon inside labeled button | `<svg aria-hidden="true">`                                                   |
| Modal dialog                          | `role="dialog" aria-modal="true" aria-labelledby="dialog-title-id"`          |
| Expanding section                     | `aria-expanded="true/false"` on the trigger                                  |
| Loading state                         | `aria-busy="true"` on the region being updated                               |
| Live region (toast, status update)    | `aria-live="polite"` (non-urgent) or `aria-live="assertive"` (urgent/errors) |
| Current page in nav                   | `aria-current="page"`                                                        |
| Error message linked to input         | `aria-describedby="error-id"` on input                                       |

### Color as the only indicator

Never use color as the **only** way to convey information. Always pair color with:

- A text label ("Required", "Error", "Success")
- An icon (✓, ✗, ⚠)
- A pattern, shape, or position change

### Reduced motion

Wrap non-essential animations:

```css
/* In globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or use Tailwind's `motion-reduce:` variant on individual utilities.

---

## 3. Color & Contrast

### WCAG AA contrast ratios

- **Normal text** (< 18px regular or < 14px bold): minimum **4.5:1** contrast ratio against background.
- **Large text** (≥ 18px regular or ≥ 14px bold): minimum **3:1**.
- **UI components** (borders of inputs, button outlines, focus rings): minimum **3:1** against adjacent colors.
- **Disabled elements**: exempt, but should still look intentionally disabled.

### How to check contrast

Use the formula or a tool. In practice: pure black (#000) on white (#fff) = 21:1. Mid-gray (#767676) on white = just at 4.5:1. Anything lighter than #767676 on white fails for small text.

### Defining your palette with CSS custom properties (Tailwind 4)

In Tailwind 4, define your palette in `globals.css` using `@theme`:

```css
@theme {
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-disabled: #9ca3af;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-text: #ffffff;
  --color-destructive: #dc2626;
  --color-success: #16a34a;
  --color-warning: #d97706;
}
```

Then reference these via `bg-[--color-accent]`, `text-[--color-text-primary]`, etc.

For dark mode, override in `.dark` or with `@media (prefers-color-scheme: dark)`.

### Semantic color naming

Name colors by **role**, not value. Use `--color-accent` not `--color-blue`. This makes theme switching and dark mode simple — you only change the token definition, not every usage.

---

## 4. Typography

### Type scale

Use a limited set of sizes. Don't use more than 5-6 distinct sizes on one page. Tailwind's scale:

| Role                 | Tailwind class           | Approx size |
| -------------------- | ------------------------ | ----------- |
| Display / hero       | `text-5xl` or `text-6xl` | 48–60px     |
| Page heading (h1)    | `text-3xl` or `text-4xl` | 30–36px     |
| Section heading (h2) | `text-2xl`               | 24px        |
| Subheading (h3)      | `text-xl`                | 20px        |
| Body                 | `text-base`              | 16px        |
| Small / caption      | `text-sm`                | 14px        |
| Micro / label        | `text-xs`                | 12px        |

### Line height

- Body text: `leading-relaxed` (1.625) or `leading-normal` (1.5). Never `leading-tight` for multi-line paragraphs.
- Headings: `leading-tight` (1.25) or `leading-snug` (1.375).
- Single-line UI elements (buttons, labels): `leading-none` is fine.

### Line length

Body text should max out at **65–75 characters per line** for optimal readability. Use `max-w-prose` (65ch) on text containers.

### Font loading (Next.js)

Always use `next/font` — never a `<link>` to Google Fonts in the `<head>`. This eliminates layout shift and self-hosts the font.

```tsx
// app/layout.tsx
import { Inter, Playfair_Display } from "next/font/google";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
```

Then in Tailwind 4 config / globals.css:

```css
@theme {
  --font-body: var(--font-body);
  --font-heading: var(--font-heading);
}
```

### Text rendering

Add to `body` or `html` globally:

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

(Tailwind's `antialiased` utility class does the first two.)

---

## 5. Spacing & Layout

### The 4px grid

All spacing should be multiples of 4px. Tailwind's spacing scale is already 4px-based (1 = 4px, 2 = 8px, 4 = 16px, 6 = 24px, 8 = 32px, etc.). Never use arbitrary pixel values unless you have a very specific reason.

### Consistent padding on containers

Pick one page-width container pattern and use it everywhere:

```tsx
// Define a reusable container
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

Don't mix `px-4`, `px-5`, `px-6` on different section wrappers — pick one and stick to it.

### Section spacing

Use a consistent vertical rhythm for section gaps. Example pattern:

- Between major sections: `py-16` or `py-24`
- Between a heading and its content: `mt-4` or `mt-6`
- Between items in a list/grid: `gap-6` or `gap-8`

### Responsive breakpoints (Tailwind defaults)

| Prefix | Min-width |
| ------ | --------- |
| `sm:`  | 640px     |
| `md:`  | 768px     |
| `lg:`  | 1024px    |
| `xl:`  | 1280px    |
| `2xl:` | 1536px    |

Design mobile-first. Start without a prefix (mobile), then add `sm:`, `md:`, etc. as the viewport grows.

### Grid vs Flexbox

- **Flexbox** (`flex`): one-dimensional layouts, nav bars, button groups, centering.
- **Grid** (`grid`): two-dimensional layouts, card grids, page-level structure.
- Avoid mixing both on the same element for the same purpose.

---

## 6. Component Patterns

### Buttons

Always define **one primary, one secondary, one destructive, one ghost** variant and use them consistently.

```tsx
// Primary
className =
  "inline-flex items-center justify-center rounded-lg bg-[--color-accent] px-4 py-2 text-sm font-medium text-[--color-accent-text] transition-colors hover:bg-[--color-accent-hover] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

// Secondary
className =
  "inline-flex items-center justify-center rounded-lg border border-[--color-border] bg-transparent px-4 py-2 text-sm font-medium text-[--color-text-primary] transition-colors hover:bg-[--color-bg-subtle] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
```

Key rules:

- Always include `disabled:pointer-events-none disabled:opacity-50` on all buttons.
- Always include focus-visible ring.
- Use `type="button"` on buttons inside forms that aren't submits.
- Minimum tap target: **44×44px** on touch devices. Add `min-h-[44px] min-w-[44px]` if the visual size is smaller.

### Cards

Define one card pattern:

```tsx
className =
  "rounded-xl border border-[--color-border] bg-[--color-surface] p-6 shadow-sm";
```

Don't mix `rounded-lg` cards with `rounded-xl` cards. Pick one.

### Links

Inline body links should always be visually distinguishable from surrounding text — at minimum, underlined or a different color.

```tsx
className =
  "text-[--color-accent] underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-1 rounded";
```

External links: always add `target="_blank" rel="noopener noreferrer"`. Optionally add an external link icon and `aria-label` suffix like `(opens in new tab)`.

### Dividers

Use `<hr>` for thematic breaks in content. Style it: `className="border-[--color-border]"`. Don't use empty `<div>` elements with margin as dividers.

### Loading states

- Add `aria-busy="true"` and a visible spinner or skeleton for async operations.
- Disable the triggering button and add a loading label: `"Saving..."` not just a spinner.

---

## 7. Performance

### Images (Next.js `<Image>`)

Always use `next/image` `<Image>` component, not `<img>`, for anything that's a static asset or URL you control:

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Description of image"
  width={1200}
  height={630}
  priority // add for above-the-fold images
  className="object-cover"
/>;
```

- Set `priority` on the largest above-the-fold image (usually the hero). This is the LCP element.
- Set explicit `width` and `height` to prevent layout shift.
- Use `sizes` prop for responsive images: `sizes="(max-width: 768px) 100vw, 50vw"`.

### Fonts

- Only load the font weights you actually use. Specify `weight: ['400', '600', '700']`.
- Only load the subsets you need. Specify `subsets: ['latin']`.

### Bundle

- Use dynamic imports for heavy components that aren't needed on initial load:
  ```tsx
  const HeavyModal = dynamic(() => import("./HeavyModal"), { ssr: false });
  ```
- Keep client components (`'use client'`) as small and as leaf-node as possible.

---

## 8. Tailwind 4 Specifics

### @theme vs tailwind.config

In Tailwind 4, configuration moves to CSS. Define your design tokens in `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-*: initial; /* optionally reset defaults */
  --color-accent: #2563eb;
  --font-sans: "Inter Variable", sans-serif;
  --radius-card: 12px;
  --spacing-section: 6rem;
}
```

### Arbitrary values

Use sparingly. `w-[337px]` is a red flag — if it's not on the scale, ask why. Acceptable uses:

- Brand-specific sizes (logo dimensions, hero heights)
- CSS custom property references: `bg-[--color-accent]`, `text-[--color-text-primary]`

### Group and peer modifiers

Use `group` / `peer` for parent-child hover/focus interactions:

```tsx
<div className="group">
  <div className="opacity-0 transition-opacity group-hover:opacity-100">
    Appears on parent hover
  </div>
</div>
```

### Avoid `@apply` in components

`@apply` is for `globals.css` base styles only. Don't use it in component files — it defeats the purpose of utility-first CSS and makes the code harder to scan.

---

## 9. Next.js Specifics

### Metadata

Every page and layout should export metadata:

```tsx
// app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | Site Name",
  description: "Accurate, concise description under 160 characters.",
  openGraph: {
    title: "Page Title",
    description: "OG description",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};
```

### `<Link>` vs `<a>`

Always use `next/link` `<Link>` for internal navigation. Use `<a>` only for external links.

### Server vs client components

Default to **Server Components** (no `'use client'` directive). Only add `'use client'` when you need:

- `useState`, `useEffect`, `useReducer`
- Event listeners (`onClick`, `onChange`, etc.)
- Browser-only APIs

Keep client components small. Pass data down as props from server components.

### Error and loading boundaries

Every route that fetches data should have a sibling `loading.tsx` and `error.tsx`:

```
app/
  dashboard/
    page.tsx
    loading.tsx   ← shown during Suspense
    error.tsx     ← shown on error
```

---

## 10. Dark Mode

### Strategy options

**Option A — CSS media query only** (simplest)

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-bg: #0f172a;
    --color-text-primary: #f8fafc;
    /* ... */
  }
}
```

**Option B — Class-based with next-themes** (allows user toggle)

1. Install: `npm install next-themes`
2. Wrap layout in `<ThemeProvider attribute="class">`
3. Use `dark:` variants throughout
4. Add a toggle button using `useTheme()`

### When to use `dark:` variants

For class-based dark mode (`darkMode: 'class'` — the default approach with next-themes):

```tsx
className = "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50";
```

Prefer using CSS custom properties (option A style) over excessive `dark:` variants — it's more maintainable.

---

## 11. Animation & Motion

### Subtle level (recommended default)

- All interactive elements: `transition-colors duration-150` (for color changes) or `transition-all duration-200`.
- Hover state changes should feel instant-ish: 100–200ms.
- Focus ring appearance: `transition-shadow duration-100`.
- Fade-in for modals/drawers: use Tailwind's `animate-in fade-in` or a simple opacity transition.

### Expressive level

Use `transition-transform` for movement, `@keyframes` in globals.css for custom animations, and consider the `tailwindcss-animate` plugin.

Key animation principles:

- **Enter** animations: fade + slight upward movement (translateY from 8–16px to 0).
- **Exit** animations: fade out only (no movement — users rarely see exits).
- **Stagger**: for lists, add `[&>*:nth-child(n)]:animation-delay` or use CSS custom property tricks.
- Nothing should animate on page load unless it serves the user (hero reveals OK; navigation bar fade-in is pointless friction).

### Duration guidelines

| Interaction type            | Duration  |
| --------------------------- | --------- |
| Hover color/shadow change   | 100–150ms |
| Fade in/out (small element) | 150–200ms |
| Slide in panel / modal      | 200–300ms |
| Page transition             | 300–400ms |
| Complex reveal / hero       | 400–600ms |

---

## 12. Forms

### Label association

Every input must have a label — either:

```tsx
// Explicit association (preferred)
<label htmlFor="email">Email address</label>
<input id="email" type="email" name="email" />

// Implicit wrapping (also valid)
<label>
  Email address
  <input type="email" name="email" />
</label>

// Visually hidden but still accessible (search inputs, etc.)
<label htmlFor="search" className="sr-only">Search</label>
<input id="search" type="search" placeholder="Search..." />
```

Never use `placeholder` as a substitute for a label. Placeholders disappear on input and have low contrast.

### Error states

- Display error message directly below the relevant field.
- Use `aria-describedby` to link the input to its error:
  ```tsx
  <input aria-describedby="email-error" aria-invalid="true" />
  <p id="email-error" role="alert" className="text-sm text-[--color-destructive]">
    Please enter a valid email address.
  </p>
  ```
- Don't rely on color alone — include error icon or text prefix.

### Required fields

- Mark required fields with `required` attribute on the input.
- Indicate visually — conventionally with an asterisk: `<span aria-hidden="true">*</span>`.
- Include a legend: `* indicates required field`.

### Submit buttons

- Label the submit action specifically: "Save changes", "Create account", "Send message" — not just "Submit".
- Add loading state on submit: disable button + show spinner + change label to "Saving...".

---

## 13. Navigation

### Main nav structure

```tsx
<header>
  <nav aria-label="Main navigation">
    <ul role="list">
      <li>
        <Link href="/" aria-current={isCurrentPage ? "page" : undefined}>
          Home
        </Link>
      </li>
      {/* ... */}
    </ul>
  </nav>
</header>
```

### Mobile nav

- The hamburger toggle button needs `aria-expanded` and `aria-controls`:
  ```tsx
  <button
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    aria-label="Toggle navigation menu"
  >
  ```
- The menu panel needs `id="mobile-menu"`.
- When the menu is open, trap focus inside it (use a focus trap library or manual implementation).
- Close on Escape key.

### Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol role="list" className="flex items-center gap-2 text-sm">
    <li>
      <Link href="/">Home</Link>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <Link href="/products">Products</Link>
    </li>
    <li aria-hidden="true">/</li>
    <li aria-current="page">Widget Pro</li>
  </ol>
</nav>
```

### Active link state

Always use `aria-current="page"` on the currently active nav link, in addition to visual styling. In Next.js, use `usePathname()` to compare.

---

_End of standards reference._
