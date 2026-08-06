"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { parseLocalDate } from "@/lib/date";

export interface EventCardData {
  title: string | null;
  description: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  image_url: string | null;
  cta_url: string | null;
}

interface EventCardProps {
  event: EventCardData;
  /** "vertical" matches the events slider card, "horizontal" matches the calendar card. */
  variant: "vertical" | "horizontal";
  className?: string;
}

function formatDateTimeLine(
  date: string | null,
  startTime: string | null,
  endTime: string | null
) {
  // Keep the existing "raw date string" display for saved events (unchanged
  // from the previous slider/calendar markup); only fall back to a
  // placeholder when there's no parseable date yet, e.g. an in-progress
  // admin draft.
  const dateLabel = parseLocalDate(date) ? date : "Select a date";
  if (!startTime) return dateLabel;
  const timeLabel = endTime
    ? `${startTime} – ${endTime}`
    : `Starts at ${startTime}`;
  return `${dateLabel} — ${timeLabel}`;
}

function CtaButton({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <div className="mt-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-block rounded bg-[#f8a102] px-3 py-1 text-sm font-bold text-white"
      >
        Learn More
      </a>
    </div>
  );
}

function LocationLine({ location }: { location: string | null }) {
  if (!location) return null;
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
      <span>{location}</span>
    </div>
  );
}

export function EventCard({ event, variant, className }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const title = event.title || "Untitled Event";
  const dateTimeLine = formatDateTimeLine(
    event.date,
    event.start_time,
    event.end_time
  );

  // Descriptions can contain blank lines between paragraphs — preserve them
  // instead of letting HTML collapse all whitespace.
  const descriptionClassName = cn(
    "whitespace-pre-line",
    !expanded && "line-clamp-4 md:line-clamp-none"
  );

  if (variant === "horizontal") {
    return (
      <div
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "flex cursor-pointer flex-col rounded-lg border md:cursor-default md:flex-row",
          className
        )}
      >
        <div className="flex flex-col gap-1 p-4 md:w-1/2">
          <h2 className="text-lg font-medium">{title}</h2>
          <LocationLine location={event.location} />
          <p className={cn("py-2 text-gray-700", descriptionClassName)}>
            {event.description}
          </p>
          <p className="font-medium">{dateTimeLine}</p>
          <p className="text-xs text-gray-400 md:hidden">
            {expanded ? "Tap to collapse ▲" : "Tap to read more ▼"}
          </p>
          <CtaButton url={event.cta_url} />
        </div>
        {event.image_url && (
          <div className="content-center md:w-1/2 md:p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image_url}
              alt={title}
              className="w-full rounded-b-lg shadow-lg md:rounded-lg"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className={cn(
        "flex h-full w-full cursor-pointer flex-col rounded-lg bg-white md:cursor-default",
        className
      )}
    >
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_url}
          alt={title}
          className="h-auto w-auto rounded-t-lg object-fill md:h-2/5"
        />
      )}
      <div className="flex flex-col gap-1 px-4 py-2 md:h-3/5">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <LocationLine location={event.location} />
        <div className="overflow-y-auto py-2">
          <p className={cn("text-gray-800", descriptionClassName)}>
            {event.description}
          </p>
        </div>
        <div className="pt-2 font-medium text-gray-700">{dateTimeLine}</div>
        <p className="text-xs text-gray-400 md:hidden">
          {expanded ? "Tap to collapse ▲" : "Tap to read more ▼"}
        </p>
        <CtaButton url={event.cta_url} />
      </div>
    </div>
  );
}
