# Description

Convert `style={{}}` inline styles to Tailwind v4 utilities, consolidate identical
className strings into named CSS classes in globals.css, and maintain a JSON registry
at `.claude/references/tailwind-map.json` to prevent duplicates across re-runs.

## Instructions

### Setup

1. Read `.claude/references/tailwind-map.json`. If missing, create it with the canonical
   `styleConversions` seed (see schema below) and empty `namedClasses`/`counters`.
2. Read `src/styles/globals.css` to know which named classes already exist.

### Phase 1 — Inline style conversion

Scan every `.tsx` file under `src/` for `style={{...}}` attributes.

For each instance:
a. Serialise the style object keys alphabetically, replacing any template-literal or
variable-interpolated values with the literal string `"DYNAMIC"`, to form a lookup key.
b. Look up the key in `styleConversions`:

- `keepAsIs: true` → leave the style prop untouched. Skip.
- `namedClassRef` is set → defer to Phase 2 to ensure the class exists, then replace
  `style={{...}}` with `className="<namedClass>"` (or append to existing className).
- `tailwind` is a string → merge into the element's `className` prop. If the className
  is already a dynamic expression, wrap with `cn(existing, newClasses)` and add the
  `cn` import from `@/lib/utils`. Remove the `style` prop.
- `dynamicClassToggle` is set → emit
  `className={cn(existingClasses, staticTailwind, dynamicToggleExpression)}`.
  Remove the `style` prop. Add `import { cn } from "@/lib/utils"` if missing.
- `keepDynamicKeys` is set → extract only those keys back into a minimal `style` prop;
  add the `tailwind` value to className; remove all other style keys.
- No match → leave as-is, log a warning in output.

### Phase 2 — Duplicate detection and named class creation

After Phase 1 conversions are computed (before writing files):

a. Record `(tagName, fullResultingClassName)` for every modified or already-converted element.
b. Group by `(tagName, fullClassName)`. A group qualifies for a named class if:

- ≥ 2 distinct source files contain it, OR
- ≥ 4 identical instances exist within a single file.
  c. For each qualifying group:
- Check `namedClasses` in the JSON map. If an entry with matching `appliedTailwind`
  already exists, reuse that name. Do not create a duplicate.
- Otherwise: `name = {tagName}{counters[tagName] ?? 1}`, then increment the counter.
  Add the entry to `namedClasses`. Append to `src/styles/globals.css` in the
  "Generated named classes" section (create it if not present, after `.pause-animation`):
  `.{name} { @apply {fullClassName}; }`
- Replace all matching `className="..."` attributes with `className="{name}"`.

### Phase 3 — Persist

Write the updated registry back to `.claude/references/tailwind-map.json`.

### Phase 4 — Verify

Run `npm run type-check`. Report: files changed, style props removed, named classes
created or reused.

---

## Canonical styleConversions seed

Use this exact object when creating the map from scratch. Dynamic values in keys are
represented by the literal string `"DYNAMIC"`.

```json
{
  "{\"fontFamily\":\"var(--font-merriweather)\"}": {
    "label": "font-merriweather",
    "tailwind": "[font-family:var(--font-merriweather)]",
    "inlineOnly": false
  },
  "{\"fontFamily\":\"var(--font-oxygen)\"}": {
    "label": "font-oxygen",
    "tailwind": "[font-family:var(--font-oxygen)]",
    "inlineOnly": false
  },
  "{\"backgroundAttachment\":\"fixed\",\"backgroundImage\":\"url('/images/Tbilisi1.jpg')\",\"backgroundSize\":\"cover\"}": {
    "label": "tbilisi-hero-bg",
    "tailwind": "bg-[url('/images/Tbilisi1.jpg')] bg-cover bg-fixed",
    "inlineOnly": false
  },
  "{\"backgroundColor\":\"rgb(244,220,211)\",\"color\":\"black\",\"mixBlendMode\":\"screen\"}": {
    "label": "word-cycle-blend",
    "tailwind": "text-black mix-blend-screen bg-[var(--color-peach)]",
    "inlineOnly": false
  },
  "{\"WebkitBackgroundClip\":\"text\",\"WebkitTextFillColor\":\"transparent\",\"backgroundColor\":\"black\",\"backgroundClip\":\"text\",\"backgroundSize\":\"200%\"}": {
    "label": "cgca-letter-highlight",
    "tailwind": null,
    "inlineOnly": false,
    "namedClassRef": "span1"
  },
  "{\"top\":\"DYNAMIC\",\"zIndex\":\"DYNAMIC\"}": {
    "label": "sticky-card-position",
    "tailwind": null,
    "inlineOnly": true,
    "keepAsIs": true
  },
  "{\"transform\":\"DYNAMIC\",\"transition\":\"transform 0.5s\"}": {
    "label": "slider-transform",
    "tailwind": "transition-transform duration-500",
    "inlineOnly": false,
    "keepDynamicKeys": ["transform"]
  },
  "{\"animation\":\"slide-rtl 20s linear infinite\",\"animationPlayState\":\"DYNAMIC\"}": {
    "label": "carousel-animation",
    "tailwind": "animate-[slide-rtl_20s_linear_infinite]",
    "inlineOnly": false,
    "dynamicClassToggle": "paused && \"pause-animation\""
  }
}
```

## Rules

- Never alter entries marked `keepAsIs: true`.
- Never create a named class for a group that appears in only one file with fewer than 4 instances.
- Preserve Prettier-formatted className whitespace conventions.
- When appending to an existing `className` string literal, add a single space before the new classes.
- `counters[tag]` starts at 1 for the first class of that tag type; the stored value is always the _next_ available number.
