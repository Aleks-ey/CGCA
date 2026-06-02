"use client";

import { useState } from "react";
import { useGallery } from "@/hooks/use-gallery";

export function GalleryDisplay() {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  const { images, events, loading, hasMore, loadMore } = useGallery(selectedEvent);
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-10 py-10">
      {/* Event filters */}
      {events.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEvent(undefined)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              !selectedEvent
                ? "bg-[var(--color-prussian-blue)] text-white border-[var(--color-prussian-blue)]"
                : "border-gray-300 text-gray-600 hover:border-[var(--color-prussian-blue)]"
            }`}
          >
            All
          </button>
          {events.map((ev) => (
            <button
              key={ev}
              onClick={() => setSelectedEvent(ev)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedEvent === ev
                  ? "bg-[var(--color-prussian-blue)] text-white border-[var(--color-prussian-blue)]"
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
        <p className="text-center py-12 text-gray-500">Loading gallery…</p>
      ) : images.length === 0 ? (
        <p className="text-center py-12 text-gray-500">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <button
              key={img.id}
              className="overflow-hidden rounded-lg aspect-square focus:outline-none focus:ring-2 focus:ring-[var(--color-rojo-red)]"
              onClick={() => setLightbox(img.image_url)}
              aria-label={`View image from ${img.event || "gallery"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={img.event || "Gallery image"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="mx-auto mt-4 px-6 py-2 rounded-lg border border-[var(--color-prussian-blue)] text-[var(--color-prussian-blue)] hover:bg-[var(--color-prussian-blue)] hover:text-white transition-colors text-sm"
        >
          Load More
        </button>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Enlarged gallery image"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none"
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
