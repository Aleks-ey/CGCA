import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { VolunteerBoard } from "@/components/admin/volunteers/volunteer-board";

export const metadata: Metadata = { title: "Volunteers" };

export default async function AdminEventVolunteersPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== "admin@admin.com") redirect("/");

  const numericEventId = Number(eventId);
  if (Number.isNaN(numericEventId)) notFound();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", numericEventId)
    .single();

  if (!event) notFound();

  const [
    { data: orgRoles },
    { data: signups },
    { data: preferredRoles },
    { data: tags },
    { data: signupTags },
  ] = await Promise.all([
    supabase
      .from("volunteer_org_roles")
      .select("*")
      .eq("event_id", event.id)
      .order("sort_order"),
    supabase
      .from("volunteer_signups")
      .select("*")
      .eq("event_id", event.id)
      .order("created_at"),
    supabase
      .from("volunteer_roles")
      .select("*")
      .eq("event_id", event.id)
      .order("sort_order"),
    supabase
      .from("volunteer_tags")
      .select("*")
      .eq("event_id", event.id)
      .order("created_at"),
    supabase.from("volunteer_signup_tags").select("*").eq("event_id", event.id),
  ]);

  return (
    <div className="px-6 py-12 md:px-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="[font-family:var(--font-merriweather)] text-3xl font-bold text-[var(--color-prussian-blue)]">
            Volunteers — {event.title}
          </h1>
          <p className="text-sm text-gray-500">{event.date}</p>
        </div>
        <Link
          href="/admin/volunteers"
          className="text-sm text-[var(--color-prussian-blue)] underline"
        >
          Back to Volunteers
        </Link>
      </div>

      <VolunteerBoard
        eventId={event.id}
        initialSignups={signups ?? []}
        initialOrgRoles={orgRoles ?? []}
        preferredRoles={preferredRoles ?? []}
        initialTags={tags ?? []}
        initialSignupTags={signupTags ?? []}
      />
    </div>
  );
}
