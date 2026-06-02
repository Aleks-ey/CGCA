"use client";

import { useState } from "react";
import { useGallery } from "@/hooks/use-gallery";

export function GalleryDisplay() {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(
    undefined
  );
  const { images, events, loading, hasMore, loadMore } =
    useGallery(selectedEvent);
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 px-4 py-10 md:px-10">
      {/* Event filters */}
      {events.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEvent(undefined)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              !selectedEvent
                ? "border-[var(--color-prussian-blue)] bg-[var(--color-prussian-blue)] text-white"
                : "border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
            }`}
          >
            All
          </button>
          {events.map((ev) => (
            <button
              key={ev}
              onClick={() => setSelectedEvent(ev)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedEvent === ev
                  ? "border-[var(--color-prussian-blue)] bg-[var(--color-prussian-blue)] text-white"
                  : "border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
              }`}
            >
              {ev}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <p className="py-12 text-center text-gray-500">Loading gallery…</p>
      ) : images.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <button
              key={img.id}
              className="aspect-square overflow-hidden rounded-lg focus:ring-2 focus:ring-[var(--color-rojo-red)] focus:outline-none"
              onClick={() => setLightbox(img.image_url)}
              aria-label={`View image from ${img.event || "gallery"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={img.event || "Gallery image"}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mx-auto mt-4 rounded-lg border border-[var(--color-prussian-blue)] px-6 py-2 text-sm text-[var(--color-prussian-blue)] transition-colors hover:bg-[var(--color-prussian-blue)] hover:text-white"
        >
          Load More
        </button>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Enlarged gallery image"
            className="max-h-full max-w-full rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-4 right-4 text-3xl leading-none text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
