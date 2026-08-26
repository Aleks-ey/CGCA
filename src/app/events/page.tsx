import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UpcomingEventsSlider } from "@/components/events/upcoming-events-slider";
import { PastEventsList } from "@/components/events/past-events-list";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date");

  const upcoming = getUpcomingEvents(events ?? []);
  const past = getPastEvents(events ?? []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-10 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="[font-family:var(--font-merriweather)] text-3xl text-[var(--color-prussian-blue)] md:text-4xl">
          Events
        </h1>
        <p className="mt-3 text-lg text-gray-700">
          From cultural celebrations to community gatherings, here&apos;s
          what&apos;s happening at CGCA.
        </p>
      </div>

      <section>
        <UpcomingEventsSlider heading="Upcoming Events" events={upcoming} />
      </section>

      {past.length > 0 && (
        <section className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-lg font-medium text-gray-500">
            Past Events
          </h2>
          <PastEventsList events={past} />
        </section>
      )}
    </div>
  );
}
