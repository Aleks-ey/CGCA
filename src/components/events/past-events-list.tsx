"use client";

import { useState } from "react";
import type { Database } from "@/types/supabase";
import { formatDisplayDate } from "@/lib/date";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

interface PastEventsListProps {
  /** Already filtered to past dates and sorted most-recent-first. */
  events: CalendarEvent[];
  initialCount?: number;
}

export function PastEventsList({
  events,
  initialCount = 5,
}: PastEventsListProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? events : events.slice(0, initialCount);
  const hiddenCount = events.length - initialCount;

  return (
    <div>
      <ul className="divide-y divide-gray-100">
        {visible.map((ev) => (
          <li
            key={ev.id}
            className="flex flex-col gap-0.5 py-3 text-sm text-gray-500 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <span className="shrink-0 font-medium text-gray-400 sm:w-36">
              {formatDisplayDate(ev.date) ?? ev.date}
            </span>
            <span className="text-gray-500">
              {ev.title || "Untitled Event"}
            </span>
            {ev.location && (
              <span className="text-gray-400">— {ev.location}</span>
            )}
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-medium text-[var(--color-prussian-blue)] hover:underline"
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
