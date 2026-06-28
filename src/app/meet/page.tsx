import boardMembersJson from "./board-members.json";
import { ProfileCard } from "@/components/ui/profile-card";

type BoardMemberData = {
  role: string;
  term_start_date: string;
  term_end_date: string;
  contact_info: { email: string; tel: string };
  bio: string;
  img?: string;
  objectPosition?: string;
};

const boardMembers = Object.entries(
  boardMembersJson as Record<string, BoardMemberData>
).map(([name, data]) => ({ name, ...data }));

export default function MeetPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl py-16 text-center">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 440 110"
            className="w-full"
          >
            <g
              fill="#7d2831"
              stroke="#1a1a1a"
              strokeWidth="1"
              strokeLinejoin="miter"
            >
              <path d="M8 26 H66 V66 H84 V88 H8 L30 57 Z" />
              <path d="M432 26 H374 V66 H356 V88 H432 L410 57 Z" />
              <rect x="66" y="8" width="308" height="58" />
              <path d="M66 66 L84 88" fill="none" />
              <path d="M374 66 L356 88" fill="none" />
            </g>
          </svg>
          <div className="absolute inset-x-[15%] top-0 flex h-[80%] flex-col items-center justify-center text-center">
            <h1 className="text-xl font-medium text-[var(--color-primary)] md:text-3xl lg:text-4xl">
              MEET THE BOARD
            </h1>
            <hr className="my-1 hidden w-1/2 border-t md:my-2 md:block" />
            <h2 className="mb-2 hidden text-lg font-medium text-[var(--color-foreground)] md:block md:text-2xl lg:text-3xl">
              DEDICATED TO CARRYING OUT OUR MISSION
            </h2>
          </div>
        </div>
        <h2 className="text-lg font-medium text-[var(--color-wine-plum)] md:hidden">
          DEDICATED TO CARRYING OUT OUR MISSION
        </h2>
      </section>

      <section className="w-full rounded-t-2xl bg-[var(--color-peach)]/40 py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 justify-items-center gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {boardMembers.map((member) => (
            <ProfileCard
              key={member.name}
              variant="cropped"
              name={member.name}
              bio={member.role}
              imageSrc={member.img!}
              imageAlt={`${member.name}, ${member.role}`}
              about={member.bio.split("\n\n")}
              croppedImageHeight={300}
              imageObjectPosition={member.objectPosition}
              className="w-full max-w-xs"
            />
          ))}
        </div>
      </section>
    </>
  );
}
