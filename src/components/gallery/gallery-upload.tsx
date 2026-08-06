"use client";

import { useState, useTransition } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { GalleryAlbumPicker } from "@/components/admin/gallery-album-picker";
import { extractImagesFromZip } from "@/lib/extract-zip-images";

const MAX_FILES_PER_BATCH = 50;
const MAX_INDIVIDUAL_FILE_BYTES = 50 * 1024 * 1024;
const MAX_TOTAL_BATCH_BYTES = 300 * 1024 * 1024;

interface UploadProgress {
  total: number;
  completed: number;
  failed: { name: string; message: string }[];
}

export function GalleryUpload({ onUploaded }: { onUploaded?: () => void }) {
  const supabase = useSupabase();
  const [album, setAlbum] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (selected.length === 0) return;

    setError(null);
    setProgress(null);

    const direct: File[] = [];
    const zipFiles: File[] = [];
    for (const f of selected) {
      if (
        f.name.toLowerCase().endsWith(".zip") ||
        f.type === "application/zip"
      ) {
        zipFiles.push(f);
      } else {
        direct.push(f);
      }
    }

    let extracted: File[] = [];
    try {
      for (const zip of zipFiles) {
        extracted = extracted.concat(await extractImagesFromZip(zip));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to read zip: ${err.message}`
          : "Failed to read zip file."
      );
      return;
    }

    const combined = [...direct, ...extracted];

    if (combined.length === 0) {
      setError("No images found in the selected files.");
      return;
    }
    if (combined.length > MAX_FILES_PER_BATCH) {
      setError(
        `Too many images (${combined.length}). Please upload at most ${MAX_FILES_PER_BATCH} at a time.`
      );
      return;
    }
    const oversized = combined.find((f) => f.size > MAX_INDIVIDUAL_FILE_BYTES);
    if (oversized) {
      setError(
        `"${oversized.name}" is too large (max ${
          MAX_INDIVIDUAL_FILE_BYTES / (1024 * 1024)
        }MB per file).`
      );
      return;
    }
    const totalBytes = combined.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > MAX_TOTAL_BATCH_BYTES) {
      setError(
        `This batch is too large (${(totalBytes / (1024 * 1024)).toFixed(
          0
        )}MB). Please upload fewer images at a time.`
      );
      return;
    }

    setPendingFiles(combined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pendingFiles.length === 0 || !album) return;

    startTransition(async () => {
      setError(null);
      setProgress({ total: pendingFiles.length, completed: 0, failed: [] });

      const rows: {
        image_url: string;
        file_name: string;
        custom_file_name: string;
        album: string;
      }[] = [];
      const failed: { name: string; message: string }[] = [];

      for (const file of pendingFiles) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const objectPath = `${album}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(objectPath, file, { cacheControl: "31536000" });

        if (uploadError) {
          failed.push({ name: file.name, message: uploadError.message });
        } else {
          const { data: urlData } = supabase.storage
            .from("gallery")
            .getPublicUrl(objectPath);
          rows.push({
            image_url: urlData.publicUrl,
            file_name: file.name,
            custom_file_name: objectPath,
            album,
          });
        }

        setProgress((prev) =>
          prev ? { ...prev, completed: prev.completed + 1, failed } : prev
        );
      }

      if (rows.length > 0) {
        const { error: dbError } = await supabase.from("gallery").insert(rows);
        if (dbError) {
          setError(dbError.message);
          return;
        }
      }

      if (failed.length > 0) {
        setError(
          `${failed.length} of ${pendingFiles.length} file(s) failed to upload.`
        );
      }

      setPendingFiles([]);
      onUploaded?.();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border p-5"
    >
      <h3 className="font-semibold">Upload Gallery Photos</h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Album</label>
        <GalleryAlbumPicker value={album} onChange={setAlbum} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">
          Photos to upload
        </span>
        <label
          htmlFor="gallery-files"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:border-[var(--color-prussian-blue)] hover:bg-gray-100"
        >
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 7.5 12 3m0 0L7.5 7.5M12 3v13.5"
            />
          </svg>
          <span className="text-sm font-semibold text-[var(--color-prussian-blue)] underline underline-offset-2">
            Click here to choose photos
          </span>
          <span className="text-xs text-gray-500">
            Select one or more image files, or a single .zip file of photos
          </span>
        </label>
        <input
          id="gallery-files"
          type="file"
          accept="image/*,.zip,application/zip"
          multiple
          onChange={handleFilesChange}
          className="sr-only"
        />
        {pendingFiles.length > 0 && (
          <p className="text-sm font-medium text-green-700">
            ✓ {pendingFiles.length} image(s) selected and ready to upload.
          </p>
        )}
      </div>

      {progress && (
        <p className="text-sm text-gray-600">
          {progress.completed} / {progress.total} uploaded
          {progress.failed.length > 0 && `, ${progress.failed.length} failed`}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || pendingFiles.length === 0 || !album}
        className="rounded-md bg-[var(--color-prussian-blue)] py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
      >
        {isPending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
