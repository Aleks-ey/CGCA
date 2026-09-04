"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The volunteer board renders its own floating action button (select mode +
// tag manager) in this same corner, so the global scroll-to-top button is
// suppressed there to avoid overlapping controls.
const VOLUNTEER_BOARD_PATTERN = /^\/admin\/volunteers\/[^/]+$/;

export function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (VOLUNTEER_BOARD_PATTERN.test(pathname)) return null;
  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-prussian-blue)] text-white shadow-lg transition-opacity hover:opacity-80"
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
