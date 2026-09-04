import { cn } from "@/lib/utils";

export interface SponsorCardData {
  sponsor: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  image_url: string | null;
}

interface SponsorCardProps {
  sponsor: SponsorCardData;
  className?: string;
}

export function SponsorCard({ sponsor, className }: SponsorCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
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
            className="break-all text-[var(--color-rojo-red)] hover:underline"
          >
            🌐 {sponsor.website}
          </a>
        )}
      </div>
    </div>
  );
}
