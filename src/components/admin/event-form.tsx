"use client";

import { useEffect, useState, useTransition } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { EventCard } from "@/components/events/event-card";
import { VolunteerRolesManager } from "@/components/admin/volunteer-roles-manager";
import type { Database } from "@/types/supabase";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

interface EventFormProps {
  mode: "create" | "edit";
  initialEvent?: EventRow;
  onSaved: () => void;
  onCancel?: () => void;
}

interface DraftState {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  ctaUrl: string;
  imageUrlInput: string;
  volunteerEnabled: boolean;
  volunteerInfo: string;
}

const EMPTY_DRAFT: DraftState = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  ctaUrl: "",
  imageUrlInput: "",
  volunteerEnabled: false,
  volunteerInfo: "",
};

function toDraft(ev?: EventRow): DraftState {
  if (!ev) return EMPTY_DRAFT;
  return {
    title: ev.title ?? "",
    description: ev.description ?? "",
    date: ev.date ?? "",
    startTime: ev.start_time ?? "",
    endTime: ev.end_time ?? "",
    location: ev.location ?? "",
    ctaUrl: ev.cta_url ?? "",
    imageUrlInput: ev.image_url ?? "",
    volunteerEnabled: ev.volunteer_enabled ?? false,
    volunteerInfo: ev.volunteer_info ?? "",
  };
}

export function EventForm({
  mode,
  initialEvent,
  onSaved,
  onCancel,
}: EventFormProps) {
  const supabase = useSupabase();
  const [draft, setDraft] = useState<DraftState>(() => toDraft(initialEvent));
  const [file, setFile] = useState<File | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialEvent?.image_url ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset the form when switching which event is being edited (or back to create).
  useEffect(() => {
    setDraft(toDraft(initialEvent));
    setPreviewUrl(initialEvent?.image_url ?? null);
    setFile(null);
    setUseUrlInput(false);
    setError(null);
  }, [initialEvent]);

  // Instant local preview for a picked-but-not-yet-uploaded file. The actual
  // storage upload is deferred to submit so abandoned file picks never leave
  // orphaned objects in the bucket.
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function updateField<K extends keyof DraftState>(
    key: K,
    value: DraftState[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleUrlInputChange(value: string) {
    updateField("imageUrlInput", value);
    setPreviewUrl(value || null);
  }

  const previewEvent = {
    id: initialEvent?.id ?? null,
    title: draft.title,
    description: draft.description,
    date: draft.date,
    start_time: draft.startTime,
    end_time: draft.endTime || null,
    location: draft.location,
    cta_url: draft.ctaUrl || null,
    image_url: previewUrl,
    volunteer_enabled: draft.volunteerEnabled,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!draft.title.trim() || !draft.description.trim() || !draft.date) {
      setError("Title, description, and date are required.");
      return;
    }

    startTransition(async () => {
      let imageUrl = useUrlInput
        ? draft.imageUrlInput
        : (initialEvent?.image_url ?? "");

      if (!useUrlInput && file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueName = `${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(uniqueName, file, { cacheControl: "31536000" });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(uniqueName);
        imageUrl = urlData.publicUrl;
      }

      const payload = {
        title: draft.title,
        description: draft.description,
        date: draft.date,
        start_time: draft.startTime,
        end_time: draft.endTime || null,
        location: draft.location,
        cta_url: draft.ctaUrl || null,
        image_url: imageUrl,
        volunteer_enabled: draft.volunteerEnabled,
        volunteer_info: draft.volunteerInfo,
      };

      const { error: dbError } =
        mode === "edit" && initialEvent
          ? await supabase
              .from("events")
              .update(payload)
              .eq("id", initialEvent.id)
          : await supabase.from("events").insert(payload);

      if (dbError) {
        setError(dbError.message);
        return;
      }

      if (mode === "create") {
        setDraft(EMPTY_DRAFT);
        setFile(null);
        setPreviewUrl(null);
        setUseUrlInput(false);
      }

      onSaved();
    });
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-3 rounded-lg border p-5"
      >
        <h3 className="font-semibold">
          {mode === "edit" ? "Edit Event" : "Add Event"}
        </h3>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="event-title"
            className="text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="event-title"
            type="text"
            value={draft.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="event-description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="event-description"
            value={draft.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
            rows={8}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="event-date"
            className="text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="event-date"
            type="date"
            value={draft.date}
            onChange={(e) => updateField("date", e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="event-start-time"
              className="text-sm font-medium text-gray-700"
            >
              Start time
            </label>
            <input
              id="event-start-time"
              type="time"
              value={draft.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              required
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="event-end-time"
              className="text-sm font-medium text-gray-700"
            >
              End time (optional)
            </label>
            <input
              id="event-end-time"
              type="time"
              value={draft.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="event-location"
            className="text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="event-location"
            type="text"
            placeholder="e.g. CGCA Community Hall"
            value={draft.location}
            onChange={(e) => updateField("location", e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="event-cta-url"
            className="text-sm font-medium text-gray-700"
          >
            Call-To-Action Link (optional)
          </label>
          <input
            id="event-cta-url"
            type="url"
            placeholder="https://…"
            value={draft.ctaUrl}
            onChange={(e) => updateField("ctaUrl", e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <p className="text-xs text-gray-500">
            Shows a &quot;Learn More&quot; button on the event card that links
            here — e.g. tickets, RSVP, or more info.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={draft.volunteerEnabled}
              onChange={(e) =>
                updateField("volunteerEnabled", e.target.checked)
              }
            />
            Enable volunteer signups for this event
          </label>
          {draft.volunteerEnabled && (
            <textarea
              id="event-volunteer-info"
              placeholder="What does volunteering for this event involve?"
              value={draft.volunteerInfo}
              onChange={(e) => updateField("volunteerInfo", e.target.value)}
              rows={3}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          )}
        </div>

        {mode === "edit" && initialEvent && draft.volunteerEnabled && (
          <VolunteerRolesManager eventId={initialEvent.id} />
        )}

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor={useUrlInput ? "event-image-url" : "event-image-file"}
              className="text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <button
              type="button"
              onClick={() => setUseUrlInput((v) => !v)}
              className="text-xs text-[var(--color-prussian-blue)] underline"
            >
              {useUrlInput
                ? "Upload a file instead"
                : "Paste an image URL instead"}
            </button>
          </div>
          {useUrlInput ? (
            <input
              id="event-image-url"
              type="text"
              placeholder="https://…"
              value={draft.imageUrlInput}
              onChange={(e) => handleUrlInputChange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          ) : (
            <input
              id="event-image-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-[var(--color-prussian-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
          >
            {isPending
              ? "Saving…"
              : mode === "edit"
                ? "Save Changes"
                : "Add Event"}
          </button>
          {mode === "edit" && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-semibold text-gray-700">Preview</h3>
        <div className="max-w-sm">
          <EventCard
            event={previewEvent}
            variant="vertical"
            className="border shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
