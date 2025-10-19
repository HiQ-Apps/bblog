// components/HeroVideo.tsx
"use client";
import { useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import {
  EASE,
  HERO_FADE_SCALE_DUR,
  HERO_WORD_STAGGER,
  HERO_UNDERLINE_DELAY,
  HERO_READY_BUFFER_MS,
} from "@/utils/anim";

export default function HeroVideo({
  onIntroDone,
}: {
  onIntroDone?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasReady = useRef(false);
  const headline = useAnimationControls();
  const underline = useAnimationControls();

  const playIntro = async () => {
    // headline container
    await headline.start({
      opacity: 1,
      scale: 1,
      transition: { duration: HERO_FADE_SCALE_DUR, ease: EASE },
    });
    // underline
    await underline.start({
      scaleX: 1,
      transition: { duration: 0.8, delay: HERO_UNDERLINE_DELAY, ease: EASE },
    });
    onIntroDone?.();
  };

  const handleCanPlay = () => {
    if (hasReady.current) return;
    hasReady.current = true;
    setTimeout(playIntro, HERO_READY_BUFFER_MS);
  };

  useEffect(() => {
    // fallback if canplay never fires (rare)
    const id = setTimeout(() => {
      if (!hasReady.current) {
        hasReady.current = true;
        playIntro();
      }
    }, 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative w-full h-[40vh] md:h-[55vh] bg-[#f3e9df] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        onCanPlay={handleCanPlay}
      >
        <source src="/homeBanner.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_55%,transparent_60%,#f3e9df_100%)]"
      />

      <div className="relative z-10 grid h-full place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={headline}
          className="relative"
        >
          <h1 className="text-[#347262] text-center text-2xl md:text-4xl font-semibold">
            {["Raise", "Your", "Standard"].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * HERO_WORD_STAGGER,
                  ease: EASE,
                }}
                className="inline-block mr-[0.3em] last:mr-0 font-playfair"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={underline}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-16 md:w-64 bg-[#347262]/40 origin-center"
          />
        </motion.div>
      </div>
    </div>
  );
}
