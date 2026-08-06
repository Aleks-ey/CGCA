"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/use-supabase";
import { GalleryUpload } from "@/components/gallery/gallery-upload";
import { EventForm } from "@/components/admin/event-form";
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
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      setDeleteError(null);
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        setDeleteError(error.message);
        return;
      }
      if (editingEvent?.id === id) setEditingEvent(null);
      refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
          <EventForm
            mode={editingEvent ? "edit" : "create"}
            initialEvent={editingEvent ?? undefined}
            onSaved={() => {
              setEditingEvent(null);
              refresh();
            }}
            onCancel={editingEvent ? () => setEditingEvent(null) : undefined}
          />

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">All Events ({events.length})</h3>
            {deleteError && (
              <p role="alert" className="text-sm text-red-600">
                {deleteError}
              </p>
            )}
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-sm text-gray-500">
                    {ev.date} at {ev.start_time}
                    {ev.end_time ? ` – ${ev.end_time}` : ""}
                  </p>
                  {ev.location && (
                    <p className="text-sm text-gray-500">{ev.location}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditingEvent(ev)}
                    className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-[var(--color-prussian-blue)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className={btnDanger}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Sponsors ({sponsors.length})</h3>
            <p className="text-sm text-gray-500">
              Manage sponsors directly from the Supabase dashboard.
            </p>
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
