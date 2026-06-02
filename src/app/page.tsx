import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeWordCycle } from "./home-word-cycle";

export const metadata: Metadata = {
  title: "CGCA — Colorado Georgian Community Association",
  description:
    "Join us: be part of a vibrant Georgian legacy in Colorado. Culture, community, and education.",
};

const aboutSections = [
  {
    title: "Georgia",
    body: "Georgia, located at the crossroads of Eastern Europe and Western Asia, boasts a rich blend of cultures, landscapes, and history. Bordered by Russia, Azerbaijan, Armenia, and Turkey, its varied terrain encompasses the stunning Caucasus Mountains and scenic Black Sea coastline. The capital, Tbilisi, with its distinctive architecture, reflects a harmonious blend of historical depth and modern vibrancy. Known for its warm hospitality and flavorful cuisine, Georgia offers a unique and enchanting experience for visitors.",
    img: "/images/MotherOfGeorgia2.jpg",
    alt: "Mother of Georgia Statue",
    topVw: 10,
    zIndex: 10,
  },
  {
    title: "Food",
    body: "Georgian cuisine offers a delightful exploration of flavors and textures, from the cheese-filled bread, khachapuri, to the flavorful dumplings known as khinkali. Pervading aromas of garlic, coriander, and fenugreek infuse various dishes, while the ancient tradition of qvevri winemaking reflects Georgia's rich agricultural and cultural heritage.",
    img: "/images/GeorgianFood.jpg",
    alt: "Assortment of Georgian Food",
    topVw: 11,
    zIndex: 20,
  },
  {
    title: "Wine",
    body: "Georgia is widely recognized by scholars as the birthplace of wine, with evidence suggesting that winemaking in the region dates back over 8,000 years. This ancient tradition is deeply embedded in the country's cultural and religious identity, with wine playing a significant role in Georgian Orthodox Christian rituals. The country's unique wine-making methods, particularly the use of qvevri (clay vessels) for fermentation, storage, and aging, further highlight Georgia's enduring and distinctive connection to the history and culture of wine.",
    img: "/images/vineyard.jpg",
    alt: "Georgian Vineyard",
    topVw: 12,
    zIndex: 30,
  },
  {
    title: "Dance",
    body: "Georgian dance, distinguished by its vibrant and dynamic movements, reflects the nation's cultural and historical narratives. With men often illustrating martial prowess and women embodying elegance and grace, these dances, set to the soulful strains of traditional music, eloquently express Georgia's cultural vitality and tradition.",
    img: "/images/GeorgianDance.jpg",
    alt: "Georgian Dance Group",
    topVw: 13,
    zIndex: 40,
  },
  {
    title: "Religion",
    body: "Georgian religion, predominantly Eastern Orthodox Christianity, plays a pivotal role in shaping the nation's culture and traditions. The Georgian Orthodox Church, influential and revered, has weathered centuries of political and social change, firmly entwining faith and identity. Notably, picturesque churches and monasteries, such as the ancient Jvari Monastery, pepper the scenic landscapes, offering both spiritual and historical journeys to explorers and pilgrims alike.",
    img: "/images/Tbilisi3.jpg",
    alt: "Tbilisi",
    topVw: 14,
    zIndex: 50,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <div className="mx-auto mt-14 flex w-[90vw] flex-col justify-center md:mx-10 md:flex-row">
        <div className="mr-4 flex w-full flex-col md:w-[45%] md:py-16">
          <h1
            className="text-[8vw] leading-[1.1] md:text-[4vw]"
            style={{ fontFamily: "var(--font-merriweather)" }}
          >
            Welcome to the Heart of Georgian Culture in Colorado!
          </h1>
          <p
            className="mt-[1vw] text-xl leading-[1.1]"
            style={{ fontFamily: "var(--font-oxygen)" }}
          >
            Join Us: Be Part of a Vibrant Georgian Legacy.
          </p>
          <div className="mt-8">
            <Link
              href="/events"
              className="inline-block rounded-[10px] border border-[var(--color-rojo-red)] bg-transparent px-8 py-[1.188rem] font-bold text-[var(--color-rojo-red)] transition-colors hover:bg-[var(--color-rojo-red)] hover:text-white"
            >
              Volunteer
            </Link>
          </div>
        </div>

        {/* Word-cycle overlay */}
        <div
          className="mt-12 flex min-h-48 items-center justify-center md:mt-0 md:min-h-0 md:w-[55%]"
          style={{
            backgroundImage: "url('/images/Tbilisi1.jpg')",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        >
          <HomeWordCycle />
        </div>
      </div>

      {/* ---- CGCA full name ---- */}
      <div className="mt-28 flex flex-col justify-center text-center">
        <h2
          className="text-[35px] leading-none"
          style={{ fontFamily: "var(--font-merriweather)" }}
        >
          <span
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundColor: "black",
              backgroundSize: "200%",
            }}
          >
            C
          </span>
          olorado{" "}
          <span
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundColor: "black",
              backgroundSize: "200%",
            }}
          >
            G
          </span>
          eorgian{" "}
          <span
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundColor: "black",
              backgroundSize: "200%",
            }}
          >
            C
          </span>
          ommunity{" "}
          <span
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundColor: "black",
              backgroundSize: "200%",
            }}
          >
            A
          </span>
          ssociation
        </h2>
      </div>

      {/* ---- Mission cards ---- */}
      <div className="flex justify-center">
        <div className="mt-10 flex flex-col justify-center px-10 text-center md:flex-row md:gap-16">
          {[
            {
              src: "/images/CGCA-LOGO(zoomedout).png",
              alt: "CGCA Logo",
              title: "Promoting Georgian Culture",
              body: "Discover the rich tapestry of Georgian culture and heritage right here in Colorado. Join us as we celebrate the timeless traditions and vibrant history of Georgia.",
            },
            {
              src: "/images/PaperPeople.svg",
              alt: "People connected",
              title: "Uniting the Georgian Community",
              body: "Come together as the Georgian community in Colorado, standing united in our shared journey towards growth, success, and development. Let's inspire, engage, and uplift one another in the spirit of unity.",
            },
            {
              src: "/images/Book.svg",
              alt: "Book icon",
              title: "Educating Georgian Youth",
              body: "Offering educational initiatives in Colorado dedicated to preserving the rich essence of Georgian culture. Join us in celebrating and learning about our cherished traditions and heritage.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="mb-8 flex flex-col text-center md:mb-0 md:w-1/4"
            >
              <Image
                src={card.src}
                alt={card.alt}
                width={200}
                height={200}
                className="mx-auto"
              />
              <h3
                className="mt-3 text-xl leading-none"
                style={{ fontFamily: "var(--font-merriweather)" }}
              >
                {card.title}
              </h3>
              <p className="mt-2 text-[18px] leading-7">{card.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- About sections (sticky scroll cards) ---- */}
      <div className="relative mt-20 w-full">
        <div className="mx-12 flex justify-center text-center">
          <h2 className="text-2xl text-gray-400">
            Explore the Wonders of Georgian Culture
          </h2>
        </div>

        {aboutSections.map((section) => (
          <div
            key={section.title}
            className="sticky mx-auto mt-6 flex w-[90%] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_0_5px_gray] md:flex-row"
            style={{ top: `${section.topVw}vw`, zIndex: section.zIndex }}
          >
            <div className="mx-[30px] mt-[10vh] md:mr-[20px] md:ml-[50px] md:w-1/2">
              <h3 className="text-[xx-large]">{section.title}</h3>
              <p className="mt-2 text-[18px] leading-[1.3] md:text-base">
                {section.body}
              </p>
            </div>
            <div className="mx-[30px] mt-[10vh] hidden md:block md:w-1/2">
              <Image
                src={section.img}
                alt={section.alt}
                width={600}
                height={400}
                className="mb-[5vw] w-full rounded-[5px] object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ---- Support CTA ---- */}
      <div className="mx-auto mt-40 mb-28 flex w-[90%] flex-col justify-center rounded-[10px] bg-[var(--color-prussian-blue)] px-2 py-12 text-center text-white shadow-[5px_5px_10px_black] md:w-[60%] md:px-6 md:py-8">
        <h2 className="text-3xl md:text-3xl">Become a Supporter Today!</h2>
        <p className="mt-4 text-lg">
          Making a meaningful impact on our local community only becomes a
          reality through the generous support of individuals like you, who
          believe in our mission and are willing to donate to help us create a
          brighter future for everyone.
        </p>
        <a
          href="https://square.link/u/20SYlc1k"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-8 inline-block rounded-[10px] border border-[var(--color-rojo-red)] bg-[var(--color-rojo-red)] px-10 py-[1.188rem] text-lg font-normal text-white transition-colors hover:bg-white hover:text-[var(--color-rojo-red)]"
        >
          Donate
        </a>
      </div>
    </>
  );
}
