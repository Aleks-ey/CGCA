import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SponsorLogoCarousel } from "@/components/sponsors/sponsor-logo-carousel";
import { SponsorList } from "@/components/sponsors/sponsor-list";

export const metadata: Metadata = { title: "Sponsors" };

export default async function SponsorsPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .order("id");

  return (
    <>
      <div className="flex flex-col justify-center bg-[var(--color-prussian-blue)] px-6 py-16 text-center text-white">
        <h1 className="h11">Our Sponsors</h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-white/80">
          We are grateful for the generous support of our sponsors who help make
          our mission possible.
        </p>
      </div>

      <SponsorLogoCarousel sponsors={sponsors ?? []} />

      <SponsorList sponsors={sponsors ?? []} />
    </>
  );
}
