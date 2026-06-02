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
        "relative flex min-h-64 items-center justify-center overflow-hidden md:min-h-96",
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
        <h1 className="[font-family:var(--font-merriweather)] text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
