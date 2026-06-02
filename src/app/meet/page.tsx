"use client";

import { useState } from "react";
import Image from "next/image";

const boardMembers = [
  {
    name: "Lasha Abashidze",
    role: "President",
    img: "/images/LashaHeadshot.JPG",
    objectPosition: "50% 10%",
    bio: `Lasha was born and raised in Tbilisi, Georgia. He pursued a career in Information Technologies and gained valuable experience working at the National Agency of Public Registry.

In 2015, Lasha relocated to the United States but missed the close-knit Georgian community back home. Determined to bring Georgians together, he initiated gatherings and provided support to those in need in Georgia. Additionally, Lasha recognized the importance of preserving Georgian culture and language for future generations, leading to the establishment of a Georgian language Sunday school.

Through his efforts, Lasha aims to unite Georgians living abroad and foster a strong sense of cultural identity and pride.

"I believe it's important for Georgians living away from home to support our people and preserve our culture." — Lasha`,
  },
  {
    name: "Ruslan Huhua",
    role: "Vice President",
    img: "/images/RuslanHeadshot.jpg",
    objectPosition: "50% 90%",
    bio: `Born and raised in the city of Sochi, Ruslan always had a passion for learning and exploring culture. After completing his early education in Sochi, he went on to pursue his studies in theology at the Tbilisi Theological Seminary and the Gelati Theological Academy and Seminary in Kutaisi, Georgia.

In 2001, Ruslan made a life-changing decision to move to the United States with his wife and two sons.

After his third son was born in the U.S.A., he started to see how important it was to preserve Georgian culture and traditions over generations. This led him to join forces with fellow Georgians to start the Colorado Georgian Community Association.`,
  },
  {
    name: "Tea Todua",
    role: "Board Director",
    img: "/images/TeaHeadshot.jpg",
    objectPosition: "50% 10%",
    bio: `Tea Todua was born and raised in the beautiful country of Georgia, next to the Black Sea in the small town of Zugdidi. She graduated from David Tvildiani Medical University with an MD degree.

Tea is committed to building a career in medicine, serving humanity. She worked as an IR (interventional radiologist) in the department of vascular surgery and mentored students at different medical schools in Georgia.

"I have always been impassioned to promote my country. In that spirit, I am very excited to join forces with my fellow members in developing cultural and educational projects and hosting events in our community of Colorado." — Tea`,
  },
  {
    name: "Alexander Narsia",
    role: "Treasurer",
    img: "/images/AlexanderHeadshot.jpg",
    objectPosition: "50% 10%",
    bio: `Alexander Narsia was born on a train in Sukhumi and raised in Tbilisi, Georgia. Thereafter he immigrated with his family to Israel at the age of 9 and to the United States of America at the age of 13. Alexander competed professionally in the sport of tennis and has transitioned into his professional career as an engineer in the oil and gas sector.

Alexander believes that being of Georgian decent is not a nationality, but a way of life and is excited to help unite the Georgian community in the State of Colorado.`,
  },
  {
    name: "Donald Pittser",
    role: "Secretary",
    img: "/images/DonaldHeadshot.jpg",
    objectPosition: "50% 50%",
    bio: `My first visit to Tbilisi, Georgia was in 2008 to visit a possible business opportunity. This resulted in me living in Tbilisi for five months in 2010. Falling in love with Georgia, like many who have been fortunate enough to visit, I returned to Georgia each year before meeting my lovely wife, Tea Todua. Now we have three little Georgian/American daughters. I am excited to help the Colorado Georgian Community Association become a reality.`,
  },
  {
    name: "Elene Murvanidze",
    role: "Board Director",
    img: "/images/EleneHeadshot.jpeg",
    objectPosition: "50% 20%",
    bio: `Elene Murvanidze was born in Rustavi, Georgia, in a uniquely diverse neighborhood that sparked her passion for cultural exchange. Eager to explore the world, Elene participated in a high school exchange in Caldwell, Idaho, and later studied Economics and Public Relations in Izmir, Turkey. She later earned a Master's at the University of Denver and a Ph.D. in Economics at Colorado State University.

As a board member of the Colorado Georgian Community Association, Elene is dedicated to strengthening the local Georgian community by fostering meaningful connections and creating opportunities for cultural exchange.`,
  },
];

function BoardMemberCard({ member }: { member: (typeof boardMembers)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group relative w-3/5 cursor-pointer overflow-hidden md:w-1/2">
        <button
          className="absolute top-0 z-10 w-full bg-slate-800 p-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
          onClick={() => setOpen(true)}
          aria-label={`View bio for ${member.name}`}
        >
          About
        </button>
        <div className="transition-all duration-300 group-hover:translate-y-[50px]">
          <Image
            src={member.img}
            alt={`${member.name}, ${member.role}`}
            width={400}
            height={256}
            className="h-64 w-full object-cover"
            style={{ objectPosition: member.objectPosition }}
          />
        </div>
        <div className="py-2 text-center">
          <h2 className="text-lg font-semibold">{member.name}</h2>
          <p className="text-gray-600">{member.role}</p>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Bio for ${member.name}`}
        >
          <div
            className="h-4/5 w-11/12 overflow-hidden rounded-lg bg-white p-8 md:h-2/3 md:w-2/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-medium">{member.name}</h3>
            <p className="text-xl font-normal text-gray-500">{member.role}</p>
            <div className="h-[calc(100%-5rem)] overflow-y-auto pt-8">
              {member.bio.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MeetPage() {
  return (
    <>
      <div className="flex justify-center pt-20 pb-10 text-center md:pt-32 md:pb-16">
        <h2 className="px-8 text-3xl font-medium text-[var(--color-prussian-blue)] md:text-5xl">
          Meet the Board
          <br />
          Dedicated to Carrying Out Our Mission
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center justify-items-center gap-y-12 py-10 md:grid md:grid-cols-3">
        {boardMembers.map((member) => (
          <BoardMemberCard key={member.name} member={member} />
        ))}
      </div>
    </>
  );
}
