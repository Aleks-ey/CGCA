# Description

Scan every source file for text elements whose color is missing, inherited ambiguously, or
too similar to their background. Fix each violation using either the project's defined color
scheme (from `.claude/references/project-styling.md`) or WCAG-safe fallbacks if no scheme
exists. Run this whenever text feels "invisible", after a design overhaul, or as a
pre-launch accessibility check.

---

# Fix Text Contrast Skill

**Stack assumption**: Next.js (App Router), TypeScript, Tailwind CSS v4. All fixes use
Tailwind utility classes — no inline `style={{}}` except as a last resort for dynamic values.

---

## Phase 1: Load Color Scheme

Check whether `.claude/references/project-styling.md` exists.

- **File exists** → Read it. Extract the following tokens and store them internally:
  - `Text primary` — the default text color for body copy on the main background
  - `Text secondary` — subdued text (captions, labels, helper text)
  - `Background` — the dominant page/container background
  - `Muted / Surface` — card or section backgrounds
  - `Primary` — brand primary (buttons, links, headings)
  - `Accent / CTA` — highlight color
  - Any other named tokens present

- **File does not exist** → Read `src/styles/globals.css` and extract the `@theme` block.
  Map those tokens to the same logical roles above using this fallback logic:
  - `--color-foreground` → Text primary
  - `--color-muted-foreground` → Text secondary
  - `--color-background` → Background
  - `--color-muted` / `--color-secondary` → Muted / Surface
  - `--color-primary` → Primary
  - `--color-accent` → Accent
    If no `@theme` block exists either, use plain WCAG-safe defaults:
  - Text primary: `text-gray-900` (on light) / `text-gray-100` (on dark)
  - Text secondary: `text-gray-600` (on light) / `text-gray-400` (on dark)

Store this mapping internally. Do not print it yet.

---

## Phase 2: Scan for Violations

Search every `.tsx`, `.jsx`, `.ts`, `.js` file under `src/` for text contrast problems.
For each file, check every element that renders visible text.

### Violation types to detect

**Type A — No color class at all**
An element has text content (or renders children that are text) but has no `text-*` color
class and no CSS variable / inline color. The text will inherit from an unknown ancestor,
which may or may not be safe.

Flag these when:

- The element is a leaf text node (e.g. `<p>`, `<span>`, `<li>`, `<td>`, `<label>`,
  `<h1>`–`<h6>`, `<a>`, `<button>`) with visible text content
- No ancestor within the same file has an explicit `text-*` color class covering it
- The component does not accept a `className` prop that would let the caller supply color

**Type B — Color too similar to background**
A `text-*` class is present but the color is close to or identical to the known or implied
background. Detect this by resolving both colors to hex (using the `@theme` values loaded
in Phase 1) and computing approximate contrast ratio.

Common patterns to catch:

- `text-white` on `bg-white` or `bg-gray-50`
- `text-gray-900` on `bg-gray-800` or `bg-gray-900`
- `text-primary` where primary ≈ background
- `text-secondary` on `bg-secondary` (same token used for both)
- Any `text-[#xxxxxx]` where the hex is within ~20 lightness units of the background hex

**Type C — Transparent or effectively invisible text**

- `text-transparent` not used as a clip-mask (i.e. no `bg-clip-text`)
- `opacity-0` on a text element with no animation that would make it visible
- `text-current` on an element whose `color` cascades to match its own background

---

## Phase 3: Build Fix Plan

For each violation found, determine the correct fix:

### Priority order for choosing the replacement color

1. **Semantic match from the loaded color scheme** — pick the token that fits the element's
   role:
   - Body copy, `<p>`, `<li>`, `<td>` → Text primary
   - Caption, helper text, `<small>`, `.text-sm` labels → Text secondary
   - Headings (`<h1>`–`<h6>`) → Text primary (or Primary if that produces sufficient contrast)
   - Links (`<a>`) → Primary (if contrast ≥ 4.5:1 against the background), else Text primary
   - Buttons — check the button's own background; use the matching foreground token
   - Badge / chip text on a colored surface — use the surface's foreground token

2. **WCAG contrast fallback** — if no scheme token achieves 4.5:1 contrast against the
   element's background, choose the nearest high-contrast option:
   - On light backgrounds (`bg-white`, `bg-gray-50`–`bg-gray-200`): use `text-gray-900`
   - On dark backgrounds (`bg-gray-700`–`bg-black`, `bg-primary`, `bg-prussian-blue`):
     use `text-white` or `text-gray-100`
   - On colored mid-tone surfaces: compute which of white or `text-gray-900` gives higher
     contrast and use that

3. **Do not change** if the element has `bg-clip-text` (gradient text is intentional).

### Constraints

- Never remove an existing color class — replace it with the correct one.
- Prefer Tailwind token classes (`text-foreground`, `text-primary-foreground`) over raw
  hex classes when the project uses `@theme` tokens.
- If the project has no named tokens, prefer semantic Tailwind scale classes
  (`text-gray-900`) over arbitrary values.
- Do not add a color to a component's root element if the component accepts `className` as
  a prop and callers are already supplying color — add a safe default only if no caller
  does.

---

## Phase 4: Apply Fixes

Edit each file with violations. For every fix:

- Add or replace the `text-*` class using the replacement chosen in Phase 3.
- If the element is inside a dark-mode variant block (`dark:...`), also check and fix the
  dark-mode color.
- If the element is a reusable component that is used on both light and dark surfaces,
  add both `text-gray-900 dark:text-gray-100` (or equivalent scheme tokens).
- Do not touch anything else in the file — spacing, layout, logic are out of scope.

After all edits, run:

```bash
npm run type-check
```

to confirm no TypeScript errors were introduced. If errors appear, read them and fix.

---

## Phase 5: Report

Print a **Contrast Fix Report**:

```
## Text Contrast Fix Complete

**Color scheme source**: project-styling.md [or: globals.css @theme tokens / WCAG defaults]

**Files changed: N**

### Fixes applied

| File | Element | Problem | Fix applied |
|------|---------|---------|-------------|
| src/app/page.tsx:42 | <p> | No color class | Added `text-foreground` |
| src/components/ui/badge.tsx:18 | <span> | text-gray-100 on bg-gray-200 (1.4:1) | Replaced with `text-gray-800` |
| ... | | | |

### Skipped (intentional / safe)
- src/app/hero.tsx:7 — `text-transparent bg-clip-text` gradient heading (intentional)

### Remaining manual review needed
- [Any case where the background is dynamic/runtime and static analysis couldn't determine it]
- [Any case where contrast is 3.1:1–4.4:1 and borderline — flag but do not auto-fix]
```

---

## Reference files

- `.claude/references/project-styling.md` — Stored color scheme (read if present)
- `src/styles/globals.css` — Tailwind v4 `@theme` tokens (fallback color source)
