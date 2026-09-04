"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { SponsorCard } from "@/components/sponsors/sponsor-card";
import type { Database } from "@/types/supabase";

type SponsorRow = Database["public"]["Tables"]["sponsors"]["Row"];

interface SponsorFormProps {
  mode: "create" | "edit";
  initialSponsor?: SponsorRow;
  onSaved: () => void;
  onCancel?: () => void;
}

interface DraftState {
  name: string;
  description: string;
  location: string;
  phone: string;
  website: string;
  imageUrlInput: string;
  logoUrlInput: string;
}

const EMPTY_DRAFT: DraftState = {
  name: "",
  description: "",
  location: "",
  phone: "",
  website: "",
  imageUrlInput: "",
  logoUrlInput: "",
};

function toDraft(sponsor?: SponsorRow): DraftState {
  if (!sponsor) return EMPTY_DRAFT;
  return {
    name: sponsor.sponsor ?? "",
    description: sponsor.description ?? "",
    location: sponsor.location ?? "",
    phone: sponsor.phone ?? "",
    website: sponsor.website ?? "",
    imageUrlInput: sponsor.image_url ?? "",
    logoUrlInput: sponsor.logo_url ?? "",
  };
}

interface ImageFieldProps {
  id: string;
  label: string;
  useUrlInput: boolean;
  onToggleMode: () => void;
  urlValue: string;
  onUrlChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
}

function ImageField({
  id,
  label,
  useUrlInput,
  onToggleMode,
  urlValue,
  onUrlChange,
  onFileChange,
}: ImageFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={onToggleMode}
          className="text-xs text-[var(--color-prussian-blue)] underline"
        >
          {useUrlInput ? "Upload a file instead" : "Paste an image URL instead"}
        </button>
      </div>
      {useUrlInput ? (
        <input
          id={id}
          type="text"
          placeholder="https://…"
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      )}
    </div>
  );
}

async function resolveImageUrl(
  supabase: ReturnType<typeof useSupabase>,
  useUrlInput: boolean,
  urlInput: string,
  file: File | null,
  existingUrl: string
): Promise<{ url: string; error?: string }> {
  if (useUrlInput) return { url: urlInput };
  if (!file) return { url: existingUrl };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueName = `${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("sponsors")
    .upload(uniqueName, file, { cacheControl: "31536000" });

  if (uploadError) return { url: existingUrl, error: uploadError.message };

  const { data: urlData } = supabase.storage
    .from("sponsors")
    .getPublicUrl(uniqueName);
  return { url: urlData.publicUrl };
}

export function SponsorForm({
  mode,
  initialSponsor,
  onSaved,
  onCancel,
}: SponsorFormProps) {
  const supabase = useSupabase();
  const [draft, setDraft] = useState<DraftState>(() => toDraft(initialSponsor));
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [useBannerUrlInput, setUseBannerUrlInput] = useState(false);
  const [useLogoUrlInput, setUseLogoUrlInput] = useState(false);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(
    initialSponsor?.image_url ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the form when switching which sponsor is being edited (or back to create).
  useEffect(() => {
    setDraft(toDraft(initialSponsor));
    setBannerPreviewUrl(initialSponsor?.image_url ?? null);
    setBannerFile(null);
    setLogoFile(null);
    setUseBannerUrlInput(false);
    setUseLogoUrlInput(false);
    setError(null);
  }, [initialSponsor]);

  // Instant local preview for a picked-but-not-yet-uploaded banner file. The
  // actual storage upload is deferred to submit so abandoned file picks
  // never leave orphaned objects in the bucket.
  useEffect(() => {
    if (!bannerFile) return;
    const objectUrl = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [bannerFile]);

  function updateField<K extends keyof DraftState>(
    key: K,
    value: DraftState[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleBannerUrlChange(value: string) {
    updateField("imageUrlInput", value);
    setBannerPreviewUrl(value || null);
  }

  const previewSponsor = {
    sponsor: draft.name || "Sponsor name",
    description: draft.description,
    location: draft.location,
    phone: draft.phone,
    website: draft.website,
    image_url: bannerPreviewUrl,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!draft.name.trim()) {
      setError("Sponsor name is required.");
      return;
    }

    setIsSubmitting(true);

    const [banner, logo] = await Promise.all([
      resolveImageUrl(
        supabase,
        useBannerUrlInput,
        draft.imageUrlInput,
        bannerFile,
        initialSponsor?.image_url ?? ""
      ),
      resolveImageUrl(
        supabase,
        useLogoUrlInput,
        draft.logoUrlInput,
        logoFile,
        initialSponsor?.logo_url ?? ""
      ),
    ]);

    if (banner.error || logo.error) {
      setError(banner.error ?? logo.error ?? "Upload failed.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      sponsor: draft.name,
      description: draft.description,
      location: draft.location,
      phone: draft.phone,
      website: draft.website || null,
      image_url: banner.url || null,
      logo_url: logo.url || null,
    };

    const { error: dbError } =
      mode === "edit" && initialSponsor
        ? await supabase
            .from("sponsors")
            .update(payload)
            .eq("id", initialSponsor.id)
        : await supabase.from("sponsors").insert(payload);

    setIsSubmitting(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    if (mode === "create") {
      setDraft(EMPTY_DRAFT);
      setBannerFile(null);
      setLogoFile(null);
      setBannerPreviewUrl(null);
      setUseBannerUrlInput(false);
      setUseLogoUrlInput(false);
    }

    onSaved();
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-3 rounded-lg border p-5"
      >
        <h3 className="font-semibold">
          {mode === "edit" ? "Edit Sponsor" : "Add Sponsor"}
        </h3>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="sponsor-name"
            className="text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="sponsor-name"
            type="text"
            value={draft.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="sponsor-description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="sponsor-description"
            value={draft.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="sponsor-location"
            className="text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="sponsor-location"
            type="text"
            value={draft.location}
            onChange={(e) => updateField("location", e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="sponsor-phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="sponsor-phone"
              type="text"
              value={draft.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="sponsor-website"
              className="text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <input
              id="sponsor-website"
              type="url"
              placeholder="https://…"
              value={draft.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <ImageField
          id="sponsor-image"
          label="Banner image"
          useUrlInput={useBannerUrlInput}
          onToggleMode={() => setUseBannerUrlInput((v) => !v)}
          urlValue={draft.imageUrlInput}
          onUrlChange={handleBannerUrlChange}
          onFileChange={setBannerFile}
        />

        <ImageField
          id="sponsor-logo"
          label="Logo (shown in the homepage carousel)"
          useUrlInput={useLogoUrlInput}
          onToggleMode={() => setUseLogoUrlInput((v) => !v)}
          urlValue={draft.logoUrlInput}
          onUrlChange={(value) => updateField("logoUrlInput", value)}
          onFileChange={setLogoFile}
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-[var(--color-prussian-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving…"
              : mode === "edit"
                ? "Save Changes"
                : "Add Sponsor"}
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
          <SponsorCard sponsor={previewSponsor} className="shadow-sm" />
        </div>
      </div>
    </div>
  );
}
