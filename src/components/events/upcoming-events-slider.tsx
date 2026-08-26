"use client";

import { useState, useRef } from "react";
import type { Database } from "@/types/supabase";
import { EventCard } from "@/components/events/event-card";
import { cn } from "@/lib/utils";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

interface UpcomingEventsSliderProps {
  heading: string;
  /** Already filtered to upcoming events, sorted soonest first. */
  events: CalendarEvent[];
}

function ArrowButton({
  direction,
  onClick,
  disabled,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous event" : "Next event"}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100 md:h-12 md:w-12",
        className
      )}
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}

export function UpcomingEventsSlider({
  heading,
  events,
}: UpcomingEventsSliderProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(events.length - 1, i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    touchStartX.current = null;
  };

  const prevDisabled = index === 0;
  const nextDisabled = index >= events.length - 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--color-prussian-blue)]">
          {heading}
        </h2>
        {events.length > 0 && (
          <div className="flex items-center gap-2 md:hidden">
            <ArrowButton
              direction="prev"
              onClick={prev}
              disabled={prevDisabled}
            />
            <ArrowButton
              direction="next"
              onClick={next}
              disabled={nextDisabled}
            />
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl bg-gray-50 p-10 text-center shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">
            No upcoming events
          </h3>
          <p className="mt-1 text-gray-500">
            Check back later for more events!
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 md:gap-6">
            <ArrowButton
              direction="prev"
              onClick={prev}
              disabled={prevDisabled}
              className="hidden md:flex"
            />

            <div
              className="-mx-3 min-w-0 flex-1 overflow-hidden md:mx-0"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex items-start transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {events.map((ev) => (
                  <div key={ev.id} className="w-full shrink-0">
                    <EventCard
                      event={ev}
                      variant="vertical"
                      size="lg"
                      className="rounded-3xl border-2 border-gray-300 bg-white shadow-lg shadow-gray-200/70"
                    />
                  </div>
                ))}
              </div>
            </div>

            <ArrowButton
              direction="next"
              onClick={next}
              disabled={nextDisabled}
              className="hidden md:flex"
            />
          </div>

          {events.length > 1 && (
            <div className="mt-4 text-center text-sm text-gray-400">
              {index + 1} / {events.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}
