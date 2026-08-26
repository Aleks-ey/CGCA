"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDisplayDate, formatDisplayTime } from "@/lib/date";

export interface EventCardData {
  id?: number | null;
  title: string | null;
  description: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  image_url: string | null;
  cta_url: string | null;
  volunteer_enabled?: boolean | null;
}

interface EventCardProps {
  event: EventCardData;
  /** "vertical" matches the events slider card, "horizontal" matches the calendar card. */
  variant: "vertical" | "horizontal";
  /** "vertical" variant only. "sm" fits narrower containers (e.g. the home page teaser carousel); "lg" (default) is the larger events-page card. */
  size?: "sm" | "lg";
  className?: string;
}

function formatDateTimeLine(
  date: string | null,
  startTime: string | null,
  endTime: string | null
) {
  const dateLabel = formatDisplayDate(date) ?? "Select a date";
  const start = formatDisplayTime(startTime);
  if (!start) return dateLabel;
  const end = formatDisplayTime(endTime);
  const timeLabel = end ? `${start} – ${end}` : `Starts at ${start}`;
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

function VolunteerButton({
  id,
  enabled,
}: {
  id: number | null | undefined;
  enabled: boolean | null | undefined;
}) {
  if (!enabled || !id) return null;
  return (
    <div className="mt-2">
      <Link
        href={`/events/${id}/volunteer`}
        onClick={(e) => e.stopPropagation()}
        className="inline-block rounded bg-[var(--color-prussian-blue)] px-3 py-1 text-sm font-bold text-white"
      >
        Volunteer
      </Link>
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

export function EventCard({
  event,
  variant,
  size = "lg",
  className,
}: EventCardProps) {
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
          <div className="flex flex-wrap gap-2">
            <CtaButton url={event.cta_url} />
            <VolunteerButton id={event.id} enabled={event.volunteer_enabled} />
          </div>
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
        "flex w-full cursor-pointer flex-col rounded-lg bg-white md:cursor-default",
        className
      )}
    >
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_url}
          alt={title}
          className={
            size === "sm"
              ? "h-40 w-full rounded-t-lg object-cover sm:h-44"
              : "h-48 w-full rounded-t-lg object-cover sm:h-56 md:h-64"
          }
        />
      )}
      <div
        className={cn(
          "flex flex-col gap-1 px-4 py-2",
          size === "lg" && "md:h-[32rem]"
        )}
      >
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <LocationLine location={event.location} />
        <div
          className={
            size === "sm"
              ? "max-h-32 overflow-y-auto py-2"
              : "overflow-y-auto py-2 md:min-h-0 md:flex-1"
          }
        >
          <p className={cn("text-gray-800", descriptionClassName)}>
            {event.description}
          </p>
        </div>
        <div className="pt-2 font-medium text-gray-700">{dateTimeLine}</div>
        <p className="text-xs text-gray-400 md:hidden">
          {expanded ? "Tap to collapse ▲" : "Tap to read more ▼"}
        </p>
        <div className="flex flex-wrap gap-2">
          <CtaButton url={event.cta_url} />
          <VolunteerButton id={event.id} enabled={event.volunteer_enabled} />
        </div>
      </div>
    </div>
  );
}
