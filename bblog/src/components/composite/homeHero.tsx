"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const HomeHero = ({ onReady }: { onReady?: () => void }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    if (imgLoaded && animDone) onReady?.();
  }, [imgLoaded, animDone, onReady]);

  return (
    <section className="relative flex justify-center items-center w-full h-64 md:h-[400px] lg:h-[500px] overflow-hidden">
      <Image
        src="/Home.png"
        alt="A cozy living room with natural light and eco-friendly decor"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        onLoad={() => setImgLoaded(true)}
      />

      {/* bottom-centered overlay */}
      <div className="absolute flex items-end p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          onAnimationComplete={() => setAnimDone(true)}
          className="w-full max-w-2xl"
        >
          <div className="flex flex-col border border-black bg-primary/80 rounded-xl px-4 py-4 md:px-8 md:py-6 md:space-y-2 text-center">
            <h1 className="font-lora text-3xl md:text-4xl lg:text-5xl font-bold">
              Elevate Your Everyday
            </h1>
            <p className="font-mont text-md md:text-lg lg:text-xl">
              Discover natural materials, clean living, and eco-friendly style
              for a healthier home.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
