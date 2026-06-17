# Description

Apply professional HTML/CSS best practices, accessibility standards, and design
consistency to a Next.js + TypeScript + Tailwind 4 codebase. Use this skill whenever
the user says anything like "polish my site", "audit my frontend", "make my website
better", "fix my styles", "improve accessibility", "clean up my UI", or "make it look
professional". If `.claude/references/project-styling.md` exists, preferences are read
from it and applied directly — no re-scanning or re-prompting. If it does not exist,
the skill runs a full scan + prompt flow first, then writes the file before applying.

---

# Web Polish Skill

**Stack assumption**: Next.js (App Router), TypeScript, Tailwind CSS v4. All output uses
Tailwind utility classes — no raw CSS except in `globals.css` or a CSS module for
things Tailwind cannot express.

---

## Setup: Check for project-styling.md

**Before doing anything else**, check whether `.claude/references/project-styling.md`
exists.

- **File exists** → Read it. Skip Phase 1 and Phase 2 entirely. Jump straight to
  Phase 3 using the preferences stored there.
- **File does not exist** → Run Phase 1 then Phase 2 to collect preferences. After
  the user confirms their choices in Phase 2, write `project-styling.md` (using the
  same template as `/project:style-config`) before starting Phase 3. This way future
  runs skip straight to Phase 3.

---

## Phase 1: Scan (only if project-styling.md is absent)

Silently read before prompting the user:

1. `src/styles/globals.css` — extract `@theme` color tokens, font variables, custom utilities.
2. `src/app/layout.tsx` — fonts loaded, `<html lang>`, global wrappers.
3. `src/app/page.tsx` + up to 4 visually complex component files (most Tailwind classes):
   - Dominant colors, spacing scale, border radius, animation usage
   - Semantic HTML quality, accessibility signals (alts, aria, focus rings)

Build an internal audit note. Do not print it — use it to inform Phase 2 suggestions.

---

## Phase 2: Surface & Prompt (only if project-styling.md is absent)

Present a short summary of findings (2–4 sentences). Then present all 8 design dimension
questions at once. For each show current state, options A/B/C, and a "keep" option.
Collect all answers before proceeding. Then confirm the plan and ask "Ready to apply?"

After confirmation, write `.claude/references/project-styling.md` using the template
in `/project:style-config` before moving to Phase 3.

### The 8 dimensions

**1. Color Palette** — neutral/professional, bold/high-contrast, warm/distinctive.
**2. Typography** — three `next/font/google` pairings (heading + body).
**3. Spacing & Density** — Compact / Balanced / Airy.
**4. Border Radius** — Sharp / Soft / Pill.
**5. Dark Mode** — Keep as-is / System-preference / User toggle.
**6. Animation & Motion** — None / Subtle / Expressive.
**7. Component Consistency** — Standardize all / New only.
**8. Accessibility Baseline** — Full WCAG 2.1 AA / Critical only / Skip.

---

## Phase 3: Apply Changes

Go through the codebase file by file. Follow `.claude/references/standards.md` for
implementation detail on every item below.

### Order of operations

1. **`globals.css` / Tailwind config** — Update `@theme` tokens with chosen palette,
   fonts, spacing, and radius.
2. **`app/layout.tsx`** — Update font loading (`next/font`), add skip-link, fix
   `<html lang>` if missing.
3. **Structural/semantic pass** — Replace `<div>` soup with `<nav>`, `<main>`,
   `<section>`, `<article>`, `<header>`, `<footer>`, `<ul>/<li>` where appropriate.
4. **Accessibility pass** — Add missing `alt`, `aria-label`, `aria-describedby`,
   focus rings, keyboard nav, per the chosen baseline.
5. **Visual consistency pass** — Standardize spacing, color tokens, border radius,
   button styles per choices.
6. **Dark mode pass** (if chosen).
7. **Animation pass** (if chosen).

### Non-negotiables (always applied regardless of choices)

- All images have `alt` text (`alt=""` for decorative)
- All interactive elements are keyboard-accessible with visible focus rings
- Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text / UI)
- No `style={{}}` for anything expressible as a Tailwind class
- No magic numbers — spacing/sizing on the Tailwind scale
- `<html lang="...">` is set
- Exactly one `<h1>` per page
- Heading hierarchy is logical (no level-skipping)
- Icon-only buttons have `aria-label`
- Form inputs have associated `<label>` elements
- External links have `target="_blank" rel="noopener noreferrer"`

---

## Reference files

- `.claude/references/project-styling.md` — Stored style preferences (read first)
- `.claude/references/standards.md` — Full HTML/CSS/accessibility/UX standards

---

## Output

After Phase 3, produce a **Polish Report**:

```
## Web Polish Complete

**Preferences sourced from**: project-styling.md [or: Phase 2 prompt]

**Changes applied:**
- [e.g. Color tokens updated in globals.css]
- [e.g. N components updated for semantic HTML]
- [e.g. N accessibility fixes applied]

**Remaining manual work:**
- [e.g. "Hero image may need a darker overlay for contrast"]
- [e.g. "Product image alt text uses placeholder descriptions — review"]
```
