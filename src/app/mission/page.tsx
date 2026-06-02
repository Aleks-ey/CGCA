import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Mission" };

export default function MissionPage() {
  return (
    <>
      <div className="flex flex-col pt-20 md:py-20 justify-center text-center overflow-hidden">
        <h2 className="text-4xl md:text-6xl text-[var(--color-rojo-red)] [font-family:serif]">
          Strength in Unity
        </h2>
        <h1 className="text-5xl md:text-8xl text-[var(--color-prussian-blue)] font-medium mt-2">
          Our Mission
        </h1>
      </div>

      <div className="flex flex-col p-10 justify-center text-left">
        <ul className="list-disc space-y-2 md:space-y-6 text-lg md:text-2xl ml-8">
          {[
            "Promote the Georgian culture and heritage within the State of Colorado.",
            "Unite, engage and inspire the Georgian Community in the State of Colorado to stand as one in support of each other's growth, success, and development.",
            "Organize events to help Georgian Community bond and assimilate.",
            "Provide educational programs for the purpose of retaining the Georgian culture in Colorado.",
          ].map((item) => (
            <li
              key={item}
              className="text-[var(--color-prussian-blue)] font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
