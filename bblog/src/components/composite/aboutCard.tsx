"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: (rm: boolean) => ({
    opacity: 1,
    transition: rm
      ? { duration: 0.2 }
      : { delayChildren: 0.05, staggerChildren: 0.12 },
  }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (rm: boolean) => ({
    opacity: 1,
    y: 0,
    transition: rm ? { duration: 0.2 } : { duration: 0.6, ease: EASE },
  }),
};

type AboutCardProps = {
  /** Optional additional delay (ms) before revealing */
  revealDelayMs?: number;
};

const AboutCard = ({ revealDelayMs = 0 }: AboutCardProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();

  // Convert ms to s for transition delay
  const delayS = reduceMotion ? 0 : revealDelayMs / 1000;

  return (
    <motion.section
      ref={ref}
      className="xl:mx-30 sm:mx-8 px-3 py-12 border-t border-b border-gray-400 mb-8"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={container}
      custom={reduceMotion}
      transition={delayS ? { delay: delayS } : undefined}
    >
      <motion.h1
        className="font-lora text-4xl font-bold mb-6 text-center"
        variants={item}
        custom={reduceMotion}
        transition={
          delayS ? { delay: delayS, duration: 0.6, ease: EASE } : undefined
        }
      >
        Welcome to The Good Standard
      </motion.h1>

      <motion.div
        className="font-mont space-y-5 text-lg leading-relaxed text-gray-800"
        variants={container}
        custom={reduceMotion}
      >
        <motion.p variants={item} custom={reduceMotion}>
          <strong>The Good Standard</strong> is an independent editorial
          exploring sustainable living, ethical fashion, and natural design. We
          believe in thoughtful consumption, natural materials, and quiet,
          enduring style.
        </motion.p>

        <motion.p variants={item} custom={reduceMotion}>
          Our focus is on practical upgrades you can feel good about. This means
          repairing, reusing, and choosing long-lasting pieces made from wool,
          linen, cotton, wood, glass, and steel. No fearmongering, no
          perfectionism — just clear, useful guidance to help you make better
          choices, little by little.
        </motion.p>

        <motion.p variants={item} custom={reduceMotion}>
          On The Good Standard, you&apos;ll find simple upgrades for your home,
          lifestyle, and daily routines. Some are as small as reusing what you
          already have in new ways; others involve finding eco-friendly, "buy it
          for life" products that actually last. None of it is about being
          perfect — it&apos;s about choosing better, little by little.
        </motion.p>

        <motion.p variants={item} custom={reduceMotion}>
          You&apos;ll find seasonal guides, product roundups, and simple rituals
          for a healthier home. When we recommend products, it&apos;s because
          they align with our criteria: natural or recycled materials where
          possible, transparent sourcing, and design that&apos;s built to last.
        </motion.p>

        <motion.p variants={item} custom={reduceMotion}>
          If you&apos;re new here, start with our latest features on natural
          fabrics, low-waste home basics, and slow wardrobe building. Settle in
          with a cup of tea, browse, and take what serves you. Sustainable,
          natural, and intentional living is a lifetime journey.
        </motion.p>

        <motion.p variants={item} custom={reduceMotion}>
          📩 For partnerships or inquiries:{" "}
          <a
            href="mailto:contact@thegoodstandard.org"
            className="underline underline-offset-4 hover:opacity-80 text-blue-600 transition-opacity"
          >
            contact@thegoodstandard.org
          </a>
        </motion.p>

        <motion.p
          className="text-sm text-gray-600 mt-2"
          variants={item}
          custom={reduceMotion}
        >
          Disclosures: Some articles may include affiliate links. Editorial
          coverage remains independent and unsponsored unless clearly noted.
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export default AboutCard;
