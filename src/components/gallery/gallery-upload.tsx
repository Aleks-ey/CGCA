"use client";

import { useState, useTransition } from "react";
import { useSupabase } from "@/hooks/use-supabase";

export function GalleryUpload({ onUploaded }: { onUploaded?: () => void }) {
  const supabase = useSupabase();
  const [eventName, setEventName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !eventName) return;

    startTransition(async () => {
      setError(null);
      const ext = file.name.split(".").pop();
      const customName = `${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(customName, file);

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(customName);

      const { error: dbError } = await supabase.from("gallery").insert({
        image_url: urlData.publicUrl,
        file_name: file.name,
        custom_file_name: customName,
        event: eventName,
      });

      if (dbError) {
        setError(dbError.message);
        return;
      }

      setFile(null);
      setEventName("");
      onUploaded?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border rounded-lg p-5">
      <h3 className="font-semibold">Upload Gallery Image</h3>
      <div className="flex flex-col gap-1">
        <label htmlFor="event-name" className="text-sm font-medium text-gray-700">
          Event Name
        </label>
        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-rojo-red)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="gallery-file" className="text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          id="gallery-file"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !file || !eventName}
        className="rounded-md bg-[var(--color-prussian-blue)] py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
      >
        {isPending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
