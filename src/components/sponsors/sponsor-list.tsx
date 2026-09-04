import { SponsorCard } from "@/components/sponsors/sponsor-card";
import type { Database } from "@/types/supabase";

type Sponsor = Database["public"]["Tables"]["sponsors"]["Row"];

interface SponsorListProps {
  sponsors: Sponsor[];
}

export function SponsorList({ sponsors }: SponsorListProps) {
  if (sponsors.length === 0) {
    return (
      <p className="py-16 text-center text-gray-500">No sponsors listed yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-6 py-10 md:grid-cols-2 md:px-12 lg:grid-cols-3">
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor.id} sponsor={sponsor} />
      ))}
    </div>
  );
}
