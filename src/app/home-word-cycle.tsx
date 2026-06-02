"use client";

import { useEffect, useRef, useState } from "react";

const SYNONYMS = ["UNION", "WHOLE", "PEACE", "LOVE", "OJAKHI", "IMEDI", "ERTAD"];

export function HomeWordCycle() {
  const [word, setWord] = useState("ERTOBA");
  const showingUnity = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    function startCycle() {
      timeout = setTimeout(() => {
        let i = 0;
        interval = setInterval(() => {
          setWord(SYNONYMS[i]);
          i = (i + 1) % SYNONYMS.length;
          if (i === 0) {
            clearInterval(interval);
            showingUnity.current = !showingUnity.current;
            setWord(showingUnity.current ? "UNITY" : "ERTOBA");
            startCycle();
          }
        }, 150);
      }, 2000);
    }

    startCycle();
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <p
      className="flex h-1/3 justify-center items-center p-4 text-[10vw] md:text-[5vw]"
      style={{
        color: "black",
        mixBlendMode: "screen",
        backgroundColor: "rgb(244, 220, 211)",
      }}
      aria-live="polite"
      aria-label={`Word: ${word}`}
    >
      {word}
    </p>
  );
}
