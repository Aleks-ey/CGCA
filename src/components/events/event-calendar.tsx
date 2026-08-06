"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Database } from "@/types/supabase";
import { EventCard } from "@/components/events/event-card";
import { parseLocalDate } from "@/lib/date";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

interface EventCalendarProps {
  events: CalendarEvent[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const eventDates = events
    .map((ev) => parseLocalDate(ev.date))
    .filter((d): d is Date => d !== null);

  const selectedEvents = selected
    ? events.filter((ev) => {
        const d = parseLocalDate(ev.date);
        return (
          d !== null &&
          d.getFullYear() === selected.getFullYear() &&
          d.getMonth() === selected.getMonth() &&
          d.getDate() === selected.getDate()
        );
      })
    : [];

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex h-fit flex-col rounded-lg border p-2 text-gray-900 md:w-1/3">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          modifiers={{ hasEvent: eventDates }}
          modifiersClassNames={{
            hasEvent:
              "border-2 border-[var(--color-prussian-blue)] rounded-full font-bold",
          }}
          classNames={{
            selected: "!bg-[#7d2831] !text-white rounded-full",
            today: "font-bold text-[var(--color-rojo-red)]",
          }}
        />
        {selected && (
          <p className="pb-2 text-center text-sm text-gray-500">
            Selected:{" "}
            {selected.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 md:w-2/3">
        {!selected && (
          <p className="text-sm text-gray-400">Select a date to see events.</p>
        )}
        {selected && selectedEvents.length === 0 && (
          <div className="rounded-lg border p-4">
            <p className="text-gray-500">No events on this date.</p>
          </div>
        )}
        {selectedEvents.map((ev) => (
          <EventCard key={ev.id} event={ev} variant="horizontal" />
        ))}
      </div>
    </div>
  );
}
