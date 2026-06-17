import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== "admin@admin.com") redirect("/");

  const [{ data: events }, { data: sponsors }] = await Promise.all([
    supabase.from("events").select("*").order("date"),
    supabase.from("sponsors").select("*").order("sponsor"),
  ]);

  return (
    <div className="px-6 py-12 md:px-16">
      <h1 className="mb-10 [font-family:var(--font-merriweather)] text-3xl font-bold text-[var(--color-prussian-blue)]">
        Admin Panel
      </h1>

      <AdminClient events={events ?? []} sponsors={sponsors ?? []} />
    </div>
  );
}
