Build a reusable `ProfileCard` component in Next.js (App Router) with TypeScript
and Tailwind CSS v4. All content comes in through props — I'm populating these
from a database, so nothing should be hardcoded.

## Goal

A polished, rounded profile card with a soft drop shadow (think modern
social/portfolio cards). It supports two layout variants and an expandable
"About" panel that lives inside the card.

## Two variants (controlled by a `variant` prop)

1. "cropped" — The profile image sits in a rounded square/rectangle at the TOP
   of the card. Below it, on a white background: the name + optional verified
   badge, a short bio, and a bottom row with the About button.
2. "full" — The profile image fills the ENTIRE card edge-to-edge. The name,
   badge, and bio are overlaid near the bottom, sitting over an optional
   blur/gradient so the text stays readable.

## Props (define and export a typed interface)

- variant: "cropped" | "full"
- name: string
- verified?: boolean // green rounded checkmark badge beside the name
- bio: string // short tagline under the name
- imageSrc: string
- imageAlt?: string
- about: string[] // paragraphs shown in the About panel
- croppedImageHeight?: number | string // height of the cropped image area
  // (cropped variant only); accept px
  // number or a CSS value; sensible default
- imageAspect?: "square" | "portrait" | number // cropped variant: shape of the
  // image area. "square" = 1:1,
  // "portrait" = taller rectangle, or a
  // raw aspect-ratio number (e.g. 0.8).
  // Should work together with / be
  // overridable by croppedImageHeight.
  // Sensible default.
- blur?: boolean // full variant: show bottom blur/gradient
- blurHeight?: number | string // full variant: how far UP the card the blur
  // reaches (px or %); sensible default
- blurStyle?: "frosted" | "gradient" // full variant: "frosted" = backdrop-blur
  // glass effect, "gradient" = solid-to-transparent
  // dark gradient. Sensible default.
- className?: string // allow the parent to override/extend styles

Make the variant-specific props gracefully ignored when not relevant (or model
them as a discriminated union if cleaner).

## About panel behavior (replaces the stats + follow button from the reference)

- Bottom-LEFT has an "About" button. No number counts, no follow button.
- Clicking it reveals a panel that animates in (fade + slide up) over the card's
  content area, showing the `about` paragraphs.
- The panel MUST stay strictly within the card bounds — card is overflow-hidden
  with rounded corners, panel is absolutely positioned inside it.
- If the text is too long, the panel scrolls internally.
- Include a close affordance (an X in the corner, and toggling the About button
  also closes it). Track open state with useState.

## Design details (match the reference aesthetic)

- Rounded corners (~rounded-3xl), soft shadow, light neutral background.
- Bold name; verified badge is a small green rounded checkmark.
- Smooth transitions on the panel and on button hover.
- Looks good at a card width around 300–340px, but don't hardcode dimensions in
  a way that breaks if the parent constrains the width.

## Quality bar

- Strict TypeScript, no `any`. Export the component and its props interface.
- Accessible: About button has aria-expanded + aria-label, image has alt text,
  panel is dismissible with Esc and traps focus reasonably.
- Use next/image for the image.
- Add a short usage example showing BOTH variants, and demonstrate the
  imageAspect and blurStyle options with placeholder data.
