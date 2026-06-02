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
        <div
          key={sponsor.id}
          className="flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          {sponsor.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sponsor.image_url}
              alt={`${sponsor.sponsor} image`}
              className="h-40 w-full rounded-lg object-cover"
            />
          )}
          <h3 className="text-lg font-semibold text-[var(--color-prussian-blue)]">
            {sponsor.sponsor}
          </h3>
          {sponsor.description && (
            <p className="text-sm text-gray-600">{sponsor.description}</p>
          )}
          <div className="mt-auto flex flex-col gap-1 text-sm text-gray-500">
            {sponsor.location && <span>📍 {sponsor.location}</span>}
            {sponsor.phone && <span>📞 {sponsor.phone}</span>}
            {sponsor.website && (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-rojo-red)] hover:underline"
              >
                🌐 {sponsor.website}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
