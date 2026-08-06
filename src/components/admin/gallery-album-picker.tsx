"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";

interface GalleryAlbumPickerProps {
  value: string | null;
  onChange: (album: string) => void;
}

const CREATE_NEW_VALUE = "__new__";

export function GalleryAlbumPicker({
  value,
  onChange,
}: GalleryAlbumPickerProps) {
  const supabase = useSupabase();
  const [albums, setAlbums] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAlbum, setNewAlbum] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAlbums() {
      setLoading(true);
      // Albums are real folders in the "gallery" storage bucket, not rows in
      // any table — folders appear in the listing with a null object id.
      const { data } = await supabase.storage
        .from("gallery")
        .list("", { limit: 200 });
      if (cancelled) return;

      const folderNames = (data ?? [])
        .filter((entry) => entry.id === null)
        .map((entry) => entry.name.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      setAlbums(folderNames);
      setLoading(false);
    }

    loadAlbums();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  function handleSelectChange(rawValue: string) {
    if (rawValue === CREATE_NEW_VALUE) {
      setCreating(true);
      return;
    }
    onChange(rawValue);
  }

  function handleConfirmNewAlbum() {
    const trimmed = newAlbum.trim();
    if (!trimmed) return;
    setCreating(false);
    setNewAlbum("");
    setAlbums((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed].sort()
    );
    onChange(trimmed);
  }

  if (creating) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-dashed border-gray-300 p-3">
        <p className="text-sm font-medium text-gray-700">New album</p>
        <input
          type="text"
          placeholder="Album name"
          value={newAlbum}
          onChange={(e) => setNewAlbum(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirmNewAlbum}
            className="rounded-md bg-[var(--color-prussian-blue)] px-3 py-1.5 text-sm text-white"
          >
            Use this album
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <select
      value={value ?? ""}
      onChange={(e) => handleSelectChange(e.target.value)}
      required
      disabled={loading}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
    >
      <option value="" disabled>
        {loading ? "Loading albums…" : "Select an album…"}
      </option>
      {albums.map((album) => (
        <option key={album} value={album}>
          {album}
        </option>
      ))}
      <option value={CREATE_NEW_VALUE}>+ Create new album…</option>
    </select>
  );
}
