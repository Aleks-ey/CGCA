import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center py-16 px-4">
      <h1
        className="text-4xl font-bold text-[var(--color-prussian-blue)] mb-4"
        style={{ fontFamily: "var(--font-merriweather)" }}
      >
        Contact Us
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-lg">
        Have a question or want to get involved? Fill out the form below and we&apos;ll get back to you.
      </p>
      {/* Jotform embedded as iframe — no external scripts injected into layout */}
      <iframe
        id="JotFormIFrame-232718136914054"
        title="CGCA Contact Form"
        src="https://form.jotform.com/232718136914054"
        className="w-full max-w-2xl min-h-[600px] border-0"
        scrolling="yes"
        allowFullScreen
      />
    </div>
  );
}
