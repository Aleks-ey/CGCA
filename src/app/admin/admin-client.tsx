"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/use-supabase";
import { GalleryUpload } from "@/components/gallery/gallery-upload";
import type { Database } from "@/types/supabase";

type CalendarEvent = Database["public"]["Tables"]["events"]["Row"];
type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];

interface AdminClientProps {
  events: CalendarEvent[];
  sponsors: Sponsor[];
}

type Tab = "events" | "gallery";

export function AdminClient({ events, sponsors }: AdminClientProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("events");
  const [isPending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "events", label: "Events" },
    { key: "gallery", label: "Gallery" },
  ];

  const btnDanger =
    "px-3 py-1 rounded text-sm border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors";

  async function deleteEvent(id: number) {
    startTransition(async () => {
      await supabase.from("events").delete().eq("id", id);
      refresh();
    });
  }

  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", time: "", image_url: "" });

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await supabase.from("events").insert(eventForm);
      setEventForm({ title: "", description: "", date: "", time: "", image_url: "" });
      refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-[var(--color-prussian-blue)] text-white"
                : "border border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isPending && <p className="text-sm text-gray-400">Saving…</p>}

      {tab === "events" && (
        <div className="flex flex-col gap-6">
          <form onSubmit={handleAddEvent} className="flex flex-col gap-3 border rounded-lg p-5">
            <h3 className="font-semibold">Add Event</h3>
            {(["title", "description", "date", "time", "image_url"] as const).map((f) => (
              <div key={f} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 capitalize">{f.replace("_", " ")}</label>
                <input
                  type={f === "date" ? "date" : "text"}
                  value={eventForm[f]}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, [f]: e.target.value }))}
                  required={f !== "image_url"}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            ))}
            <button type="submit" className="rounded-md bg-[var(--color-prussian-blue)] py-2 text-sm text-white">
              Add Event
            </button>
          </form>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">All Events ({events.length})</h3>
            {events.map((ev) => (
              <div key={ev.id} className="flex justify-between items-start border rounded-lg p-4 gap-4">
                <div>
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-sm text-gray-500">{ev.date} at {ev.time}</p>
                </div>
                <button onClick={() => deleteEvent(ev.id)} className={btnDanger}>Delete</button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Sponsors ({sponsors.length})</h3>
            <p className="text-sm text-gray-500">Manage sponsors directly from the Supabase dashboard.</p>
          </div>
        </div>
      )}

      {tab === "gallery" && (
        <div className="flex flex-col gap-6">
          <GalleryUpload onUploaded={refresh} />
        </div>
      )}
    </div>
  );
}
