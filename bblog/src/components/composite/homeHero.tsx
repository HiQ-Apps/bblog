"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";

type HomeHeroProps = {
  onReady?: () => void;
  marqueeWord?: string;
  taglines?: string[];
  background?: string;
};

const HomeHero = ({
  onReady,
  marqueeWord = "ELEVATE",
  taglines = ["your standards", "your future", "your life", "your choices", "your knowledge"],
  background = "#c89b83",
}: HomeHeroProps) => {
  const [introDone, setIntroDone] = useState(false);
  const [tagIndex, setTagIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const { scrollYProgress: pageY } = useScroll(); 
  const glowOpacity = useTransform(pageY, [0, 0.3], [0.18, 0.04]); 

  useEffect(() => {
    if (!taglines.length) return;
    const fade = reduceMotion ? 0 : 300;
    const hold = 2000;
    const id = setInterval(() => setTagIndex((i) => (i + 1) % taglines.length), fade * 2 + hold);
    return () => clearInterval(id);
  }, [taglines.length, reduceMotion]);

  useEffect(() => {
    if (introDone) onReady?.();
  }, [introDone, onReady]);

  const letters = useMemo(() => marqueeWord.split(""), [marqueeWord]);
  const lettersContainer = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.15, when: "beforeChildren" } },
  };
  const letterUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={sectionRef}
      className="
        relative w-full overflow-hidden
        flex items-center justify-center
        min-h-[28svh] sm:min-h-[34svh] md:min-h-[42svh] lg:min-h-[48svh]
        "
      style={{ background: background.startsWith("bg-") ? undefined : background }}
    >
      {background.startsWith("bg-") && <div className={`${background} absolute inset-0`} />}

      {/* soft radial glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[15%] rounded-[999px]"
        style={{
          background: "radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
          opacity: glowOpacity,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl px-3 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14 flex flex-col items-center">
        <motion.h1
          aria-label={marqueeWord}
          style={{ y: wordY }}
          className="font-playfair leading-[0.85] tracking-[-0.01em] text-primary select-none"
        >
          <motion.span
            className="
              inline-block whitespace-nowrap  /* <- keeps ELEVATE on one line */
              text-[clamp(36px,16vw,200px)]
              sm:text-[clamp(56px,12vw,230px)]
              md:text-[clamp(72px,9.5vw,250px)]  /* slightly smaller so it fits */
              lg:text-[clamp(84px,9vw,270px)]
              "
            variants={lettersContainer}
            initial="hidden"
            animate="show"
            onAnimationComplete={() => setIntroDone(true)}
          >
            {letters.map((ch, i) => (
              <motion.span key={`${ch}-${i}`} className="inline-block" variants={letterUp}>
                {ch === " " ? <span style={{ width: "0.35em", display: "inline-block" }} /> : ch}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>

        {/* TAGLINE — looping crossfade in a fixed-height wrapper (no layout jump) */}
        <div className="mt-2 sm:mt-3 min-h-[1.6em]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={tagIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="max-w-[58ch] text-center font-lora text-[clamp(14px,3.8vw,18px)]
                         sm:text-[clamp(16px,2.4vw,20px)] text-primary"
            >
              {taglines[tagIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
