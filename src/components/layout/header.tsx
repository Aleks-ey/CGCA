"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Route } from "next";

const navLinks: { href: Route<string>; label: string }[] = [
  { href: "/meet", label: "Meet the Board" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="flex h-auto items-center p-1 md:px-2 md:py-1">
        {/* Logo */}
        <Link
          href="/"
          className="block shrink-0"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/images/CGCA-LOGO.png"
            alt="Colorado Georgian Community Association"
            width={80}
            height={80}
            className="w-14 md:w-20"
            priority
          />
        </Link>

        {/* Title (hidden when mobile menu open) */}
        {!isMenuOpen && (
          <Link href="/" className="flex flex-col p-1 lg:p-2">
            <span className="text-lg font-semibold text-[var(--color-prussian-blue)]">
              CGCA
            </span>
          </Link>
        )}

        {/* Expanded title when menu open (mobile) */}
        {isMenuOpen && (
          <Link href="/" className="z-20 pl-1 text-sm leading-tight text-white">
            Colorado Georgian
            <br />
            Community Association
          </Link>
        )}

        <span className="flex-1" />

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--color-rojo-red)]",
                pathname === href
                  ? "text-[var(--color-rojo-red)]"
                  : "text-[var(--color-prussian-blue)]"
              )}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://square.link/u/20SYlc1k"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[var(--color-rojo-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-rojo-red)]/80"
          >
            Donate
          </a>
        </nav>

        {/* Hamburger (mobile) */}
        <button
          className="z-20 ml-2 p-2 text-[var(--color-prussian-blue)] lg:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile expanded menu */}
      {isMenuOpen && (
        <nav
          className="fixed inset-0 z-10 flex flex-col gap-4 bg-[var(--color-prussian-blue)] pt-20 pl-6"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            className="text-lg text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-lg text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://square.link/u/20SYlc1k"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Donate
          </a>
        </nav>
      )}
    </header>
  );
}
