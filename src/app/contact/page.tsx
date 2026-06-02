import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16">
      <h1
        className="mb-4 text-4xl font-bold text-[var(--color-prussian-blue)]"
        style={{ fontFamily: "var(--font-merriweather)" }}
      >
        Contact Us
      </h1>
      <p className="mb-10 max-w-lg text-center text-gray-600">
        Have a question or want to get involved? Fill out the form below and
        we&apos;ll get back to you.
      </p>
      {/* Jotform embedded as iframe — no external scripts injected into layout */}
      <iframe
        id="JotFormIFrame-232718136914054"
        title="CGCA Contact Form"
        src="https://form.jotform.com/232718136914054"
        className="min-h-[600px] w-full max-w-2xl border-0"
        scrolling="yes"
        allowFullScreen
      />
    </div>
  );
}
