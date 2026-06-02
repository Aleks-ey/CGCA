import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SponsorLogoCarousel } from "@/components/sponsors/sponsor-logo-carousel";
import { SponsorList } from "@/components/sponsors/sponsor-list";

export const metadata: Metadata = { title: "Sponsors" };

export default async function SponsorsPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase.from("sponsors").select("*").order("id");

  return (
    <>
      <div className="flex flex-col justify-center text-center py-16 px-6 bg-[var(--color-prussian-blue)] text-white">
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-merriweather)" }}>
          Our Sponsors
        </h1>
        <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
          We are grateful for the generous support of our sponsors who help make our mission possible.
        </p>
      </div>

      <SponsorLogoCarousel sponsors={sponsors ?? []} />

      <SponsorList sponsors={sponsors ?? []} />
    </>
  );
}
