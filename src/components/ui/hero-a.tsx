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
    <div className="flex flex-col justify-center p-8 md:p-12 md:w-1/2">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-prussian-blue)] leading-tight [font-family:var(--font-merriweather)]">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{description}</p>
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
    <div className="relative md:w-1/2 h-64 md:h-auto min-h-64">
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
        "flex flex-col md:flex-row overflow-hidden rounded-lg shadow-md",
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
