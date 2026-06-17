import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Mission" };

export default function MissionPage() {
  return (
    <>
      <div className="flex flex-col justify-center overflow-hidden pt-20 text-center md:py-20">
        <h2 className="[font-family:serif] text-4xl text-[var(--color-rojo-red)] md:text-6xl">
          Strength in Unity
        </h2>
        <h1 className="mt-2 text-5xl font-medium text-[var(--color-prussian-blue)] md:text-8xl">
          Our Mission
        </h1>
      </div>

      <div className="flex flex-col justify-center p-10 text-left">
        <ul className="ml-8 list-disc space-y-2 text-lg md:space-y-6 md:text-2xl">
          {[
            "Promote the Georgian culture and heritage within the State of Colorado.",
            "Unite, engage and inspire the Georgian Community in the State of Colorado to stand as one in support of each other's growth, success, and development.",
            "Organize events to help Georgian Community bond and assimilate.",
            "Provide educational programs for the purpose of retaining the Georgian culture in Colorado.",
          ].map((item) => (
            <li
              key={item}
              className="font-medium text-[var(--color-prussian-blue)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
