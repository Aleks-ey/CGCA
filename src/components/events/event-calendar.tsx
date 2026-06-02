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
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col md:w-1/3 rounded-lg border p-2 h-fit">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          modifiers={{ hasEvent: eventDates }}
          modifiersClassNames={{
            hasEvent: "border-2 border-[var(--color-prussian-blue)] rounded-full font-bold",
          }}
        />
        {selected && (
          <p className="text-sm text-center text-gray-500 pb-2">
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

      <div className="md:w-2/3 flex flex-col gap-4">
        {!selected && (
          <p className="text-gray-400 text-sm">Select a date to see events.</p>
        )}
        {selected && selectedEvents.length === 0 && (
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">No events on this date.</p>
          </div>
        )}
        {selectedEvents.map((ev) => (
          <div key={ev.id} className="flex flex-col md:flex-row border rounded-lg">
            <div className="md:w-1/2 p-4">
              <h2 className="text-lg font-medium">{ev.title}</h2>
              <p className="py-2 text-gray-700">{ev.description}</p>
              <p className="font-medium">
                {ev.date} &nbsp;—&nbsp; Starts at {ev.time}
              </p>
            </div>
            {ev.image_url && (
              <div className="md:w-1/2 md:p-2 content-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ev.image_url}
                  alt={ev.title}
                  className="shadow-lg rounded-b-lg md:rounded-lg w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
