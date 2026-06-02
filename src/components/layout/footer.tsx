import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="flex flex-col md:flex-row justify-evenly gap-10 py-8 pl-6 md:pl-0 flex-wrap">
        {/* Org info */}
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-semibold">Colorado Georgian Community Association</p>
          <p>Denver, CO</p>
          <p>(720) 939-9244</p>
          <p>info@cgca-ertoba.com</p>
          <p>events@cgca-ertoba.com</p>
        </div>

        {/* Info links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold pb-2">INFO</h3>
          <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/mission" className="text-sm text-slate-300 hover:text-white transition-colors">
            Our Mission
          </Link>
          <Link href="/meet" className="text-sm text-slate-300 hover:text-white transition-colors">
            Meet the Board
          </Link>
          <Link href="/events" className="text-sm text-slate-300 hover:text-white transition-colors">
            Events
          </Link>
        </div>

        {/* Contact links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold pb-2">CONTACT</h3>
          <Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">
            Volunteer
          </Link>
          <Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">
            Donate
          </Link>
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold pb-2">SOCIALS</h3>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9"
            aria-label="Facebook"
          >
            <Image
              src="/icons/facebook-brands-solid.svg"
              alt="Facebook"
              width={36}
              height={36}
              className="filter-white"
            />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 mt-1"
            aria-label="Instagram"
          >
            <Image
              src="/icons/instagram-brands-solid.svg"
              alt="Instagram"
              width={36}
              height={36}
              className="filter-white"
            />
          </a>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Colorado Georgian Community Association. All rights reserved.
      </div>
    </footer>
  );
}
