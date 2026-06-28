"use client";

import { useState, useRef } from "react";
import type { Database } from "@/types/supabase";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

interface EventSliderProps {
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

  const upcoming = events.filter((ev) => {
    const evDate = new Date(ev.date);
    const now = new Date();
    const twoMonths = new Date();
    twoMonths.setMonth(now.getMonth() + 2);
    return evDate >= now && evDate <= twoMonths;
  });

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="mx-auto flex flex-col bg-[var(--color-prussian-blue)] pb-6 md:w-1/3">
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
            disabled={index >= upcoming.length - 1}
            aria-label="Next event"
            className="p-1 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        className="content-center overflow-hidden bg-[var(--color-wine-plum)] p-4 whitespace-nowrap md:max-h-[500px] md:w-2/3"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {upcoming.length === 0 ? (
          <div className="inline-block rounded-lg bg-white p-4">
            <h2 className="text-lg font-medium text-gray-900">
              No upcoming events
            </h2>
            <p className="text-gray-700">Check back later for more events!</p>
          </div>
        ) : (
          upcoming.map((ev, i) => (
            <div
              key={ev.id}
              className="inline-block h-full w-full overflow-hidden rounded-lg align-top whitespace-normal shadow-[var(--color-prussian-blue)] shadow-md transition-transform duration-500 md:w-1/3"
              style={{ transform: `translateX(${(i - index) * 100}%)` }}
            >
              <div className="flex h-full w-full flex-col rounded-lg bg-white">
                {ev.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.image_url}
                    alt={ev.title}
                    className="h-auto w-auto rounded-t-lg object-fill md:h-2/5"
                  />
                )}
                <div className="flex flex-col px-4 py-2 md:h-3/5">
                  <h2 className="text-lg font-medium text-gray-900">
                    {ev.title}
                  </h2>
                  <div className="overflow-y-auto py-2">
                    <p className="text-gray-800">{ev.description}</p>
                  </div>
                  <div className="pt-2 font-medium text-gray-700">
                    {ev.date} &nbsp;—&nbsp; Starts at {ev.time}
                  </div>
                  <div className="mt-2">
                    <a
                      href="https://ticketstripe.com/independencedaygeorgia"
                      target="_top"
                      className="inline-block rounded bg-[#f8a102] px-3 py-1 text-sm font-bold text-white"
                    >
                      Click Here to Buy Tickets
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
