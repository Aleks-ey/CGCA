"use client";

import { useState, useRef } from "react";
import type { Database } from "@/types/supabase";
import { EventCard } from "@/components/events/event-card";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

interface EventSliderProps {
  /** Already filtered to the events this slider should show, sorted soonest first. */
  events: CalendarEvent[];
}

export function EventSlider({ events }: EventSliderProps) {
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

  return (
    <div className="flex flex-col bg-[var(--color-wine-plum)] md:flex-row">
      {/* Left panel */}
      <div className="mx-auto flex flex-col bg-[var(--color-prussian-blue)] pb-6 md:w-1/4">
        <div className="mt-4 ml-4 text-white md:mt-28">
          <h1 className="text-4xl font-medium">Upcoming Events</h1>
          <p className="py-2 text-2xl font-light">
            Check out all of our upcoming events within the next two months.
          </p>
        </div>
        <div className="mr-6 ml-auto flex scale-150 flex-row text-white md:mt-24">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous event"
            className="p-1 disabled:opacity-40"
          >
            ‹
          </button>
          <button
            onClick={next}
            disabled={index >= events.length - 1}
            aria-label="Next event"
            className="p-1 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        className="content-center overflow-hidden bg-[var(--color-wine-plum)] p-4 whitespace-nowrap md:max-h-[680px] md:w-3/4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {events.length === 0 ? (
          <div className="inline-block rounded-lg bg-white p-4">
            <h2 className="text-lg font-medium text-gray-900">
              No upcoming events
            </h2>
            <p className="text-gray-700">Check back later for more events!</p>
          </div>
        ) : (
          events.map((ev, i) => (
            <div
              key={ev.id}
              className="inline-block h-full w-full overflow-hidden rounded-lg align-top whitespace-normal shadow-[var(--color-prussian-blue)] shadow-md transition-transform duration-500 md:w-1/2"
              style={{ transform: `translateX(${(i - index) * 100}%)` }}
            >
              <EventCard event={ev} variant="vertical" size="sm" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
