import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EventSlider } from "@/components/events/event-slider";
import { EventCalendar } from "@/components/events/event-calendar";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date");

  return (
    <>
      <EventSlider events={events ?? []} />

      <div className="flex flex-col justify-center px-4 py-20 md:px-10">
        <h2 className="mb-6 text-2xl font-semibold">Calendar View</h2>
        <EventCalendar events={events ?? []} />
      </div>
    </>
  );
}
