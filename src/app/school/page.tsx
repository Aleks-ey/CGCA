import type { Metadata, Route } from "next";
import Link from "next/link";
import Image from "next/image";
// import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Deda Ena — Georgian Sunday School",
  description:
    "Deda Ena is a Georgian Sunday School in Denver, Colorado, where children learn the Georgian language and explore Georgian history, culture, and traditions.",
};

// function PhotoPlaceholder({
//   label,
//   className,
// }: {
//   label: string;
//   className?: string;
// }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center rounded-lg bg-[var(--color-peach)]",
//         className
//       )}
//     >
//       <div className="text-center text-gray-700">
//         <svg
//           className="mx-auto mb-3 h-12 w-12 opacity-40"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//           />
//         </svg>
//         <p className="text-sm font-medium">{label}</p>
//       </div>
//     </div>
//   );
// }

export default function SchoolPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="mx-auto mt-14 flex w-[90vw] flex-col gap-10 md:flex-row md:items-center md:gap-16">
        <div className="flex flex-col md:w-1/2">
          <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--color-rojo-red)] uppercase">
            Georgian Sunday School · Denver, Colorado
          </p>
          <h1 className="[font-family:var(--font-cormorant)] text-5xl leading-tight font-bold text-[var(--color-prussian-blue)] md:text-6xl">
            Deda Ena
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-700">
            Denver is home to hundreds of children of Georgian heritage —
            children of recently immigrated families and children born in the
            United States. As parents help their children become engaged members
            of American society, they also recognize the importance of
            preserving their cultural roots and the Georgian language.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={"/contact" as Route<string>}
              className="inline-block rounded-md bg-[var(--color-rojo-red)] px-7 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-rojo-red)]/85 focus-visible:ring-2 focus-visible:ring-[var(--color-rojo-red)] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Enroll Your Child
            </Link>
          </div>
        </div>
        <div className="relative min-h-72 w-full overflow-hidden rounded-lg md:min-h-96 md:w-1/2">
          <Image
            src="/images/sunday-school/class1.jpg"
            alt="Deda Ena class"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 45vw"
          />
        </div>
      </section>

      {/* ---- About / Mission ---- */}
      <section id="about" className="mt-20 bg-slate-50 px-8 py-16 md:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 [font-family:var(--font-cormorant)] text-3xl font-bold text-[var(--color-prussian-blue)] md:text-4xl">
            Bridging Educational Needs Through Heritage and Culture
          </h2>
          <p className="text-lg leading-relaxed text-gray-800">
            In 2024, the Colorado Georgian Community Association Ertoba
            established <strong>Deda Ena</strong> to support families in
            strengthening language, cultural connection, and a sense of
            community among younger generations. Through language instruction
            and creative educational activities, students develop Georgian
            reading, writing, and conversational skills while learning about
            Georgian history, culture, and traditions.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-gray-800">
            Today, our school serves twenty students in a welcoming environment
            where instruction is adapted to each child&apos;s age and needs.
            More than a language program, Deda Ena is a place where Georgian
            children build friendships, share traditions, strengthen cultural
            identity, and experience community.
          </p>
        </div>
      </section>

      {/* ---- Stats strip ---- */}
      <section className="bg-[var(--color-wine-plum)] px-8 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center text-white md:flex-row md:justify-around md:gap-0">
          {[
            { value: "20", label: "Students Enrolled" },
            { value: "2024", label: "Year Founded" },
            { value: "Every Sunday", label: "Class Schedule" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="[font-family:var(--font-cormorant)] text-4xl font-bold">
                {value}
              </p>
              <p className="mt-1 text-sm font-medium tracking-widest text-white/70 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Curriculum ---- */}
      <section className="mx-auto mt-20 flex w-[90vw] flex-col gap-12 md:flex-row md:items-center md:gap-16">
        <div className="relative min-h-64 w-full overflow-hidden rounded-lg md:w-1/2">
          <Image
            src="/images/sunday-school/grads.jpg"
            alt="Deda Ena curriculum materials"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 45vw"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="mb-5 [font-family:var(--font-cormorant)] text-3xl font-bold text-[var(--color-prussian-blue)] md:text-4xl">
            Our Curriculum
          </h2>
          <p className="leading-relaxed text-gray-700">
            Our curriculum is inspired by the educational philosophy of Georgian
            educator <strong>Iakob Gogebashvili</strong> and his iconic textbook{" "}
            <em>Deda Ena</em> — a foundational resource in Georgian education to
            this day.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            We also incorporate additional materials, including <em>33 Keys</em>{" "}
            and literary and informational texts from open sources developed
            with support from USAID in Tbilisi (2018–2022). Instruction is
            always adapted to each child&apos;s age and level.
          </p>
          <p className="mt-4 leading-relaxed text-gray-700">
            Our greatest inspiration is seeing students approach learning
            Georgian with enthusiasm, curiosity, and pride.
          </p>
        </div>
      </section>

      {/* ---- Educator ---- */}
      <section className="mt-20 bg-[var(--color-prussian-blue)] px-8 py-16 md:px-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-10 md:flex-row md:items-center md:gap-16">
          <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-lg md:h-72 md:w-64">
            <Image
              src="/headshots/TamaraKoHeadshot.jpeg"
              alt="Tamar Kochlamazashvili, educator"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 90vw, 256px"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold tracking-widest text-[var(--color-rojo-red)] uppercase">
              Meet Our Educator
            </p>
            <h2 className="mb-4 [font-family:var(--font-cormorant)] text-3xl font-bold text-[var(--color-primary)] md:text-4xl">
              Tamar Kochlamazashvili
            </h2>
            <p className="leading-relaxed text-white">
              Tamar Kochlamazashvili leads the educational program, bringing
              more than <strong>25 years of experience</strong> working with
              children in both Georgia and the United States. She specializes in
              English Language and Literature and Early Childhood Development,
              and has taught in schools and child development centers in
              Tbilisi, Georgia, and Denver, Colorado.
            </p>
            <p className="mt-4 leading-relaxed text-white">
              Drawing on extensive classroom experience and expertise in
              languages, Mrs. Tamar creates meaningful educational experiences
              tailored to each child&apos;s needs.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Supporters ---- */}
      <section className="mx-auto mt-20 w-[90vw] max-w-3xl text-center">
        <h2 className="mb-5 [font-family:var(--font-cormorant)] text-3xl font-bold text-[var(--color-prussian-blue)]">
          Our Supporters
        </h2>
        <p className="mx-auto max-w-xl leading-relaxed text-gray-700">
          We are grateful for the continued financial and technical support of{" "}
          <strong>The Georgian Association</strong>, a nationwide nonprofit
          organization supporting the Georgian American community. Since 2025,
          it has served as the principal donor of Georgian Sunday School in
          Denver, Colorado.
        </p>
        <div className="mt-8 flex justify-center">
          {/* <PhotoPlaceholder
            label="Supporter logo coming soon"
            className="h-32 w-64"
          /> */}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <div className="mx-auto mt-20 mb-28 flex w-[90%] flex-col items-center justify-center rounded-lg bg-[var(--color-prussian-blue)] px-6 py-12 text-center text-white shadow-[5px_5px_10px_black] md:w-[60%]">
        <h2 className="[font-family:var(--font-cormorant)] text-3xl font-bold text-white md:text-4xl">
          Enroll Your Child in Deda Ena
        </h2>
        <p className="mt-4 max-w-md text-lg text-white/80">
          Give your child the gift of language, culture, and community. Get in
          touch to learn about enrollment and upcoming class schedules.
        </p>
        <Link
          href={"/contact" as Route<string>}
          className="mt-8 inline-block rounded-md border border-[var(--color-rojo-red)] bg-[var(--color-rojo-red)] px-10 py-3 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-[var(--color-rojo-red)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          Contact Us
        </Link>
      </div>
    </>
  );
}
