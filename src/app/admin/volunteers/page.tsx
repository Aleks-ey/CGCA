import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Volunteers" };

export default async function AdminVolunteersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== "admin@admin.com") redirect("/");

  const [{ data: events }, { data: signups }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("volunteer_enabled", true)
      .order("date"),
    supabase.from("volunteer_signups").select("event_id"),
  ]);

  const counts = new Map<number, number>();
  for (const s of signups ?? []) {
    counts.set(s.event_id, (counts.get(s.event_id) ?? 0) + 1);
  }

  return (
    <div className="px-6 py-12 md:px-16">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="[font-family:var(--font-merriweather)] text-3xl font-bold text-[var(--color-prussian-blue)]">
          Volunteers
        </h1>
        <Link
          href="/admin"
          className="text-sm text-[var(--color-prussian-blue)] underline"
        >
          Back to Admin
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <p className="text-sm text-gray-500">
          No events have volunteer signups enabled yet. Enable it from an
          event&apos;s editor on the{" "}
          <Link href="/admin" className="underline">
            Admin page
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href={`/admin/volunteers/${ev.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:border-[var(--color-prussian-blue)]"
            >
              <div>
                <p className="font-medium">{ev.title}</p>
                <p className="text-sm text-gray-500">{ev.date}</p>
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {counts.get(ev.id) ?? 0} volunteer
                {(counts.get(ev.id) ?? 0) === 1 ? "" : "s"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
