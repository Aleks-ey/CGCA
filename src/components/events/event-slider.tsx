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
      <div className="flex flex-col md:w-1/3 mx-auto pb-6 bg-[var(--color-prussian-blue)]">
        <div className="text-white ml-4 mt-4 md:mt-28">
          <h1 className="text-4xl font-medium">Upcoming Events</h1>
          <p className="text-2xl font-light py-2">
            Check out all of our upcoming events within the next two months.
          </p>
        </div>
        <div className="flex flex-row ml-auto mr-6 md:mt-24 text-white scale-150">
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous event"
            className="disabled:opacity-40 p-1"
          >
            ‹
          </button>
          <button
            onClick={next}
            disabled={index >= upcoming.length - 1}
            aria-label="Next event"
            className="disabled:opacity-40 p-1"
          >
            ›
          </button>
        </div>
      </div>

      {/* Slider */}
      <div
        className="md:w-2/3 md:max-h-[500px] p-4 content-center overflow-hidden whitespace-nowrap bg-[var(--color-rojo-red)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {upcoming.length === 0 ? (
          <div className="p-4 inline-block rounded-lg bg-white">
            <h2 className="text-lg font-medium">No upcoming events</h2>
            <p>Check back later for more events!</p>
          </div>
        ) : (
          upcoming.map((ev, i) => (
            <div
              key={ev.id}
              className="h-full w-full md:w-1/3 overflow-hidden inline-block rounded-lg shadow-md shadow-[var(--color-prussian-blue)] align-top whitespace-normal"
              style={{
                transform: `translateX(${(i - index) * 100}%)`,
                transition: "transform 0.5s",
              }}
            >
              <div className="flex flex-col h-full w-full bg-white rounded-lg">
                {ev.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.image_url}
                    alt={ev.title}
                    className="h-auto md:h-2/5 w-auto rounded-t-lg object-fill"
                  />
                )}
                <div className="flex flex-col md:h-3/5 px-4 py-2">
                  <h2 className="text-lg font-medium">{ev.title}</h2>
                  <div className="py-2 overflow-y-auto">
                    <p>{ev.description}</p>
                  </div>
                  <div className="pt-2 font-medium">
                    {ev.date} &nbsp;—&nbsp; Starts at {ev.time}
                  </div>
                  <div className="mt-2">
                    <a
                      href="https://ticketstripe.com/independencedaygeorgia"
                      target="_top"
                      className="inline-block bg-[#f8a102] text-white text-sm font-bold px-3 py-1 rounded"
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
