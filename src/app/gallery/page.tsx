import type { Metadata } from "next";
import { GalleryDisplay } from "@/components/gallery/gallery-display";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <>
      <div className="flex flex-col justify-center bg-[var(--color-prussian-blue)] px-6 py-16 text-center text-white">
        <h1
          className="text-4xl font-bold md:text-5xl"
          style={{ fontFamily: "var(--font-merriweather)" }}
        >
          Gallery
        </h1>
        <p className="mt-4 text-xl text-white/80">
          Photos from our community events and celebrations.
        </p>
      </div>
      <GalleryDisplay />
    </>
  );
}
