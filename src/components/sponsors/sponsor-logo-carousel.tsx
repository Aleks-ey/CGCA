"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];

interface SponsorLogoCarouselProps {
  sponsors: Sponsor[];
}

export function SponsorLogoCarousel({ sponsors }: SponsorLogoCarouselProps) {
  const [paused, setPaused] = useState(false);

  const withLogos = sponsors.filter((s) => s.logo_url);
  if (withLogos.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...withLogos, ...withLogos];

  return (
    <div
      className="shadow-inner-y-lg relative overflow-hidden bg-white py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Sponsor logo carousel"
    >
      <div
        className={cn(
          "flex w-max animate-[slide-rtl_20s_linear_infinite] gap-12",
          paused && "pause-animation"
        )}
      >
        {items.map(
          (sponsor, i) =>
            sponsor.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${sponsor.id}-${i}`}
                src={sponsor.logo_url}
                alt={`${sponsor.sponsor} logo`}
                className="h-16 w-auto object-contain"
              />
            )
        )}
      </div>
    </div>
  );
}
