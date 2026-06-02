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
      <div className="flex flex-col md:flex-row justify-center mt-14 mx-auto md:mx-10 w-[90vw]">
        <div className="flex flex-col mr-4 md:py-16 w-full md:w-[45%]">
          <h1
            className="leading-[1.1] text-[8vw] md:text-[4vw]"
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
          className="flex mt-12 md:mt-0 justify-center items-center md:w-[55%] min-h-48 md:min-h-0"
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
      <div className="flex flex-col mt-28 justify-center text-center">
        <h2
          className="text-[35px] leading-none"
          style={{ fontFamily: "var(--font-merriweather)" }}
        >
          <span style={{ WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", backgroundColor: "black", backgroundSize: "200%" }}>C</span>olorado{" "}
          <span style={{ WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", backgroundColor: "black", backgroundSize: "200%" }}>G</span>eorgian{" "}
          <span style={{ WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", backgroundColor: "black", backgroundSize: "200%" }}>C</span>ommunity{" "}
          <span style={{ WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", backgroundColor: "black", backgroundSize: "200%" }}>A</span>ssociation
        </h2>
      </div>

      {/* ---- Mission cards ---- */}
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row px-10 mt-10 justify-center md:gap-16 text-center">
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
            <div key={card.title} className="flex flex-col md:w-1/4 text-center mb-8 md:mb-0">
              <Image
                src={card.src}
                alt={card.alt}
                width={200}
                height={200}
                className="mx-auto"
              />
              <h3
                className="text-xl leading-none mt-3"
                style={{ fontFamily: "var(--font-merriweather)" }}
              >
                {card.title}
              </h3>
              <p className="text-[18px] leading-7 mt-2">{card.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- About sections (sticky scroll cards) ---- */}
      <div className="w-full relative mt-20">
        <div className="flex mx-12 justify-center text-center">
          <h2 className="text-gray-400 text-2xl">Explore the Wonders of Georgian Culture</h2>
        </div>

        {aboutSections.map((section) => (
          <div
            key={section.title}
            className="sticky flex flex-col md:flex-row mt-6 w-[90%] mx-auto bg-white rounded-[10px] shadow-[0_0_5px_gray] overflow-hidden"
            style={{ top: `${section.topVw}vw`, zIndex: section.zIndex }}
          >
            <div className="mt-[10vh] mx-[30px] md:ml-[50px] md:mr-[20px] md:w-1/2">
              <h3 className="text-[xx-large]">{section.title}</h3>
              <p className="text-[18px] leading-[1.3] mt-2 md:text-base">{section.body}</p>
            </div>
            <div className="hidden md:block mt-[10vh] mx-[30px] md:w-1/2">
              <Image
                src={section.img}
                alt={section.alt}
                width={600}
                height={400}
                className="w-full object-cover rounded-[5px] mb-[5vw]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ---- Support CTA ---- */}
      <div className="flex flex-col mx-auto mt-40 mb-28 py-12 px-2 md:px-6 md:py-8 justify-center text-center text-white rounded-[10px] shadow-[5px_5px_10px_black] bg-[var(--color-prussian-blue)] w-[90%] md:w-[60%]">
        <h2 className="text-3xl md:text-3xl">Become a Supporter Today!</h2>
        <p className="mt-4 text-lg">
          Making a meaningful impact on our local community only becomes a reality through the
          generous support of individuals like you, who believe in our mission and are willing to
          donate to help us create a brighter future for everyone.
        </p>
        <a
          href="https://square.link/u/20SYlc1k"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 mx-auto inline-block rounded-[10px] border border-[var(--color-rojo-red)] bg-[var(--color-rojo-red)] px-10 py-[1.188rem] font-normal text-white text-lg transition-colors hover:bg-white hover:text-[var(--color-rojo-red)]"
        >
          Donate
        </a>
      </div>
    </>
  );
}
