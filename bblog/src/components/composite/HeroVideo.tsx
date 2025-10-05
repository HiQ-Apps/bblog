// components/HeroVideo.tsx
"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroVideo({ onReady }: { onReady?: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasCalledReady = useRef(false);

  const handleCanPlay = () => {
    if (!hasCalledReady.current) {
      hasCalledReady.current = true;
      // Small delay to ensure video has started
      setTimeout(() => onReady?.(), 800);
    }
  };

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

      {/* Feather edges into the page's cream (#f3e9df) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_55%,transparent_60%,#f3e9df_100%)]"
      />

      {/* Headline overlay with synced animation */}
      <div className="relative z-10 grid h-full place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative"
        >
          <h1 className="text-[#347262] text-center text-2xl md:text-4xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
            {["Raise", "Your", "Standards."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * 0.15,
                  ease: EASE,
                }}
                className="inline-block mr-[0.3em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtle underline accent that draws in */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-16 md:w-64 bg-[#347262]/40 origin-center"
          />
        </motion.div>
      </div>
    </div>
  );
}
