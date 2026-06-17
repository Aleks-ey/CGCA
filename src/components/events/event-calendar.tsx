"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import type { Database } from "@/types/supabase";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];

interface EventCalendarProps {
  events: CalendarEvent[];
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const eventDates = events.map((ev) => parseLocalDate(ev.date));

  const selectedEvents = selected
    ? events.filter((ev) => {
        const d = parseLocalDate(ev.date);
        return (
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
          <div
            key={ev.id}
            className="flex flex-col rounded-lg border md:flex-row"
          >
            <div className="p-4 md:w-1/2">
              <h2 className="text-lg font-medium">{ev.title}</h2>
              <p className="py-2 text-gray-700">{ev.description}</p>
              <p className="font-medium">
                {ev.date} &nbsp;—&nbsp; Starts at {ev.time}
              </p>
            </div>
            {ev.image_url && (
              <div className="content-center md:w-1/2 md:p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ev.image_url}
                  alt={ev.title}
                  className="w-full rounded-b-lg shadow-lg md:rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
