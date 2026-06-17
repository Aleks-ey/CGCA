"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProfileCardBase {
  name: string;
  /** Green rounded checkmark badge shown beside the name. */
  verified?: boolean;
  /** Short tagline displayed under the name. */
  bio: string;
  imageSrc: string;
  imageAlt?: string;
  /** Paragraphs rendered in the About panel. */
  about: string[];
  /** CSS object-position value to reframe the image within its container (e.g. "50% 20%"). */
  imageObjectPosition?: string;
  className?: string;
}

interface ProfileCardCropped extends ProfileCardBase {
  variant: "cropped";
  /**
   * Height of the image area. Pass a number for px, or any CSS string (e.g. "14rem").
   * When provided, overrides `imageAspect`.
   */
  croppedImageHeight?: number | string;
  /**
   * Aspect ratio of the image container.
   * "square" = 1:1 | "portrait" = 3:4 | number = width-to-height (>1 wider, <1 taller).
   * Ignored when `croppedImageHeight` is set.
   */
  imageAspect?: "square" | "portrait" | number;
}

interface ProfileCardFull extends ProfileCardBase {
  variant: "full";
  /** Whether to render a blur/gradient overlay at the bottom. */
  blur?: boolean;
  /** How far up the card the overlay reaches. Number = px, string = any CSS value. Default "50%". */
  blurHeight?: number | string;
  /**
   * "frosted" = backdrop-blur glass effect.
   * "gradient" = dark linear gradient (default).
   */
  blurStyle?: "frosted" | "gradient";
}

/** @see ProfileCardCropped @see ProfileCardFull */
export type ProfileCardProps = ProfileCardCropped | ProfileCardFull;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildImageContainerStyle(
  croppedImageHeight?: number | string,
  imageAspect?: "square" | "portrait" | number
): React.CSSProperties {
  if (croppedImageHeight !== undefined) {
    return {
      position: "relative",
      height:
        typeof croppedImageHeight === "number"
          ? `${croppedImageHeight}px`
          : croppedImageHeight,
    };
  }
  if (imageAspect !== undefined) {
    let ratio: string;
    if (imageAspect === "square") ratio = "1 / 1";
    else if (imageAspect === "portrait") ratio = "3 / 4";
    else ratio = `1 / ${imageAspect}`;
    return { position: "relative", aspectRatio: ratio };
  }
  return { position: "relative", height: "14rem" };
}

function resolveBlurHeight(blurHeight?: number | string): string {
  if (blurHeight === undefined) return "50%";
  return typeof blurHeight === "number" ? `${blurHeight}px` : blurHeight;
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

function VerifiedBadge() {
  return (
    <span
      aria-label="Verified"
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500"
    >
      <svg
        className="h-3 w-3 text-white"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 6l3 3 5-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface NameRowProps {
  name: string;
  verified?: boolean;
  light?: boolean;
}

function NameRow({ name, verified, light }: NameRowProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "truncate text-base leading-tight font-bold",
          light ? "text-white" : "text-[var(--color-prussian-blue)]"
        )}
      >
        {name}
      </span>
      {verified && <VerifiedBadge />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileCard
// ---------------------------------------------------------------------------

export function ProfileCard(props: ProfileCardProps) {
  const {
    name,
    verified,
    bio,
    imageSrc,
    imageAlt,
    about,
    imageObjectPosition,
    className,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      aboutButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Esc key dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const aboutButton = (
    <button
      ref={aboutButtonRef}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls="about-panel"
      aria-label={isOpen ? `Close about ${name}` : `About ${name}`}
      className={cn(
        "mt-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        "border-[var(--color-rojo-red)] text-[var(--color-rojo-red)]",
        "hover:bg-[var(--color-rojo-red)] hover:text-white"
      )}
    >
      About
    </button>
  );

  const aboutPanel = (
    <div
      id="about-panel"
      role="dialog"
      aria-modal="true"
      aria-label={`About ${name}`}
      className={cn(
        "absolute inset-0 z-20 flex flex-col p-4",
        "bg-white/95 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        isOpen
          ? "pointer-events-auto visible translate-y-0 opacity-100"
          : "pointer-events-none invisible translate-y-4 opacity-0"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-prussian-blue)]">
          About
        </span>
        <button
          ref={closeButtonRef}
          onClick={toggle}
          aria-label="Close about panel"
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            "text-slate-500 transition-colors",
            "hover:bg-slate-100 hover:text-slate-800"
          )}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {about.map((para, i) => (
          <p
            key={i}
            className="mb-3 text-sm leading-relaxed text-slate-800 last:mb-0"
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );

  // ── Cropped variant ──────────────────────────────────────────────────────
  if (props.variant === "cropped") {
    const { croppedImageHeight, imageAspect } = props;
    const imgContainerStyle = buildImageContainerStyle(
      croppedImageHeight,
      imageAspect
    );

    return (
      <article
        className={cn(
          "relative overflow-hidden rounded-3xl shadow-md",
          "bg-[var(--color-secondary)]",
          className
        )}
      >
        <div {...(isOpen ? { inert: true } : {})} className="contents">
          {/* Image area */}
          <div style={imgContainerStyle} className="overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt ?? name}
              fill
              className="object-cover"
              style={
                imageObjectPosition
                  ? { objectPosition: imageObjectPosition }
                  : undefined
              }
              sizes="(max-width: 400px) 100vw, 340px"
            />
          </div>

          {/* Content area */}
          <div className="bg-white px-4 pt-3 pb-4">
            <NameRow name={name} verified={verified} />
            <p className="mt-0.5 truncate text-sm text-[var(--color-muted-foreground)]">
              {bio}
            </p>
            {aboutButton}
          </div>
        </div>

        {aboutPanel}
      </article>
    );
  }

  // ── Full variant ─────────────────────────────────────────────────────────
  const { blur, blurHeight, blurStyle = "gradient" } = props;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl shadow-md",
        className
      )}
    >
      <div {...(isOpen ? { inert: true } : {})} className="contents">
        {/* Full-bleed image */}
        <Image
          src={imageSrc}
          alt={imageAlt ?? name}
          fill
          className="object-cover"
          style={
            imageObjectPosition
              ? { objectPosition: imageObjectPosition }
              : undefined
          }
          sizes="(max-width: 400px) 100vw, 340px"
        />

        {/* Optional blur / gradient overlay */}
        {blur && (
          <div
            aria-hidden="true"
            style={{ height: resolveBlurHeight(blurHeight) }}
            className={cn(
              "absolute right-0 bottom-0 left-0 z-10",
              blurStyle === "frosted"
                ? "bg-white/10 backdrop-blur-md"
                : "bg-gradient-to-t from-black/70 to-transparent"
            )}
          />
        )}

        {/* Text overlay */}
        <div className="absolute right-0 bottom-0 left-0 z-10 p-4">
          <NameRow name={name} verified={verified} light />
          <p className="mt-0.5 text-sm text-white/80">{bio}</p>
          {aboutButton}
        </div>
      </div>

      {aboutPanel}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Usage example
// ---------------------------------------------------------------------------

/**
 * Quick demo of both variants. Drop this onto any page to verify the component.
 *
 * Cropped: portrait aspect ratio, explicit image height.
 * Full:    frosted blur overlay, consumer-supplied height via className.
 */
export function ProfileCardExample() {
  const sharedAbout = [
    "Born and raised in Tbilisi, Georgia, Nino discovered her passion for community building early in life.",
    "After relocating to Colorado in 2018, she joined the CGCA founding team and has led cultural programming every year since.",
    "Outside of her board role she teaches Georgian folk dance and runs a small language school for children.",
  ];

  return (
    <div className="flex flex-wrap gap-6 p-8">
      {/* Cropped — portrait aspect, explicit height */}
      <ProfileCard
        variant="cropped"
        name="Nino Beridze"
        verified
        bio="Cultural director & board member"
        imageSrc="https://picsum.photos/seed/nino/400/600"
        imageAlt="Portrait of Nino Beridze"
        imageAspect="portrait"
        croppedImageHeight={280}
        about={sharedAbout}
        className="w-72"
      />

      {/* Cropped — square aspect, no explicit height */}
      <ProfileCard
        variant="cropped"
        name="Giorgi Kvaratskhelia"
        bio="Founding member & events lead"
        imageSrc="https://picsum.photos/seed/giorgi/400/400"
        imageAspect="square"
        about={sharedAbout}
        className="w-72"
      />

      {/* Full — frosted blur style */}
      <ProfileCard
        variant="full"
        name="Tamar Janelidze"
        verified
        bio="Language & education committee"
        imageSrc="https://picsum.photos/seed/tamar/400/600"
        blur
        blurStyle="frosted"
        blurHeight="55%"
        about={sharedAbout}
        className="h-96 w-72"
      />

      {/* Full — gradient blur style */}
      <ProfileCard
        variant="full"
        name="Levan Mchedlishvili"
        bio="Sponsorship & partnerships"
        imageSrc="https://picsum.photos/seed/levan/400/600"
        blur
        blurStyle="gradient"
        about={sharedAbout}
        className="h-96 w-72"
      />
    </div>
  );
}
