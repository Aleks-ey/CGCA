import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroBProps {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  children?: React.ReactNode;
}

export function HeroB({
  title,
  description,
  imageSrc,
  imageAlt,
  className,
  children,
}: HeroBProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-64 md:min-h-96 items-center justify-center overflow-hidden",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* dark overlay */}
      <div className="absolute inset-0 bg-[var(--color-prussian-blue)]/60" />
      <div className="relative z-10 px-6 py-12 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold [font-family:var(--font-merriweather)]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
