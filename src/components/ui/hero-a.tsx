import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Route } from "next";

interface HeroAProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: Route<string>;
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
  className?: string;
}

export function HeroA({
  title,
  description,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt,
  imageLeft = false,
  className,
}: HeroAProps) {
  const textBlock = (
    <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
      <h1 className="[font-family:var(--font-merriweather)] text-3xl leading-tight font-bold text-[var(--color-prussian-blue)] md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          {description}
        </p>
      )}
      {buttonText && buttonHref && (
        <div className="mt-8">
          <Link
            href={buttonHref}
            className="inline-block rounded-[10px] border border-[var(--color-rojo-red)] bg-[var(--color-rojo-red)] px-8 py-4 font-bold text-white transition-colors hover:bg-white hover:text-[var(--color-rojo-red)]"
          >
            {buttonText}
          </Link>
        </div>
      )}
    </div>
  );

  const imageBlock = (
    <div className="relative h-64 min-h-64 md:h-auto md:w-1/2">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-lg shadow-md md:flex-row",
        className
      )}
    >
      {imageLeft ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
