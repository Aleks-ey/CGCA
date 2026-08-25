import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseLocalDate } from "@/lib/date";
import { VolunteerSignupForm } from "@/components/volunteer/volunteer-signup-form";

export const metadata: Metadata = { title: "Volunteer" };

export default async function EventVolunteerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const numericId = Number(id);
  if (Number.isNaN(numericId)) notFound();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", numericId)
    .single();

  if (!event || !event.volunteer_enabled) notFound();

  const { data: roles } = await supabase
    .from("volunteer_roles")
    .select("*")
    .eq("event_id", event.id)
    .order("sort_order");

  const dateLabel = parseLocalDate(event.date) ? event.date : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12 md:px-0">
      <div className="flex flex-col gap-1">
        <h1 className="[font-family:var(--font-merriweather)] text-3xl font-bold text-[var(--color-prussian-blue)]">
          Volunteer — {event.title}
        </h1>
        {(dateLabel || event.location) && (
          <p className="text-sm text-gray-600">
            {dateLabel}
            {dateLabel && event.location ? " — " : ""}
            {event.location}
          </p>
        )}
      </div>

      {event.volunteer_info && (
        <p className="whitespace-pre-line text-gray-800">
          {event.volunteer_info}
        </p>
      )}

      <VolunteerSignupForm eventId={event.id} roles={roles ?? []} />
    </div>
  );
}
