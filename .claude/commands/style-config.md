# Description

Scan the project's current design and interactively define the project's style preferences
across color, typography, spacing, radius, dark mode, animation, consistency, and
accessibility. Writes the results to `.claude/references/project-styling.md` so that
`/project:web-polish` and `/project:make-new-page` can apply or follow those preferences
without re-scanning or re-prompting. Run this once when setting up a new project, or
re-run to update preferences.

---

# Style Config Skill

---

## Phase 1: Scan

Silently read the following before prompting the user for anything:

1. `src/styles/globals.css` (or `app/globals.css`) — extract `@theme` color tokens, font
   variables, any custom utilities.
2. `src/app/layout.tsx` — note fonts loaded, `<html lang>`, global wrappers.
3. `src/app/page.tsx` + up to 4 of the most visually complex component files (pick those
   with the most Tailwind classes) — note dominant colors, spacing scale, border radius
   pattern, animation usage, semantic HTML quality, accessibility signals.

Build a concise internal audit note covering:

- Primary / accent / background colors (hex or token name)
- Heading font + body font
- Dominant spacing values
- Border radius pattern
- Dark mode presence
- Animation level
- Semantic HTML quality (good / mixed / mostly divs)
- Accessibility gaps (missing alts, aria, focus rings)
- Design system maturity (ad hoc / partial tokens / full tokens)

Do not print the audit note — use it to inform your Phase 2 suggestions.

---

## Phase 2: Prompt

Present a short conversational summary of what you found (2–4 sentences). Then present
all 8 design dimension questions at once in a single structured message. For each
dimension show:

- **Current**: what you found in the codebase
- **Options A / B / C**: three Claude-suggested alternatives suited to this project type
- **Keep**: an explicit "keep current" option

Wait for the user to answer all 8 before continuing. If they answer partially, ask for
the remaining ones before proceeding.

### The 8 dimensions

**1. Color Palette**
Suggest: one neutral/professional, one bold/high-contrast, one warm/distinctive.
Frame each as: primary + accent + background.

**2. Typography**
Suggest three `next/font/google` pairings (heading + body) suited to the site's tone:
one geometric/modern, one humanist/readable, one editorial/distinctive.

**3. Spacing & Density**

- Compact — tighter padding/gaps, good for data-heavy UIs
- Balanced — standard 4px-grid rhythm, good for most sites
- Airy — generous whitespace, good for editorial/portfolio

**4. Border Radius**

- Sharp (`rounded-none` / `rounded-sm`)
- Soft (`rounded-lg`)
- Pill (`rounded-full` buttons, `rounded-2xl` cards)

**5. Dark Mode**

- Keep as-is
- System-preference only (`@media prefers-color-scheme`)
- Full user toggle (`next-themes`)

**6. Animation & Motion**

- None
- Subtle (hover transitions, smooth focus rings)
- Expressive (page transitions, scroll reveals)

**7. Component Consistency**

- Standardize all interactive elements to a single defined pattern
- Only enforce standards on new components, leave existing ones as-is

**8. Accessibility Baseline**

- Full WCAG 2.1 AA pass (focus rings, aria, contrast, skip links)
- Critical fixes only (missing alts, broken focus)
- Skip

---

## Phase 3: Write project-styling.md

Once the user has confirmed their choices, write `.claude/references/project-styling.md`
using the template below. Fill every field with the user's actual decision — no
placeholders.

```markdown
# Project Styling

> Managed by /project:style-config. Edit manually or re-run the skill to update.

## Color Palette

- **Primary**: [name] — `[CSS variable or hex]`
- **Accent / CTA**: [name] — `[CSS variable or hex]`
- **Background**: [value]
- **Muted / Surface**: [value]
- **Destructive**: [value]
- **Text primary**: [value]
- **Text secondary**: [value]

## Typography

- **Heading font**: [font name] — `[CSS variable]` — Tailwind: `[font-family class]`
- **Body font**: [font name] — `[CSS variable]` — Tailwind: `[font-family class]`

## Spacing & Density

[Compact / Balanced / Airy] — [one sentence describing the rhythm, e.g. "px-6 py-4 sections, gap-6 grids"]

## Border Radius

[Sharp / Soft / Pill] — `[primary radius class, e.g. rounded-lg]` on cards/containers,
`[primary radius class]` on buttons.

## Dark Mode

[None / System-preference / User toggle] — [one sentence on implementation approach]

## Animation & Motion

[None / Subtle / Expressive] — [one sentence on what that means for this project]

## Component Consistency

[Standardize all / New components only]

## Accessibility Baseline

[Full WCAG 2.1 AA / Critical fixes only / Skip]

## Tailwind Named Classes (generated)

List any `.h11`, `.span1`, etc. classes in `globals.css` that encode project-wide
patterns, so skills know not to re-create them.

- [class name]: [what it encodes]

## Notes

[Any project-specific caveats — e.g. "brand colors must not be changed", "Georgian
cultural site — warm tones are intentional"]
```

After writing the file, confirm to the user:

> `project-styling.md` saved to `.claude/references/`. Run `/project:web-polish` to
> apply these styles to the codebase, or `/project:make-new-page` to create a new page
> that already follows them.
