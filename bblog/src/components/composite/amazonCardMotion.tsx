// components/client/AmazonCardMotion.tsx
"use client";
import * as React from "react";
import { motion } from "framer-motion";

export function MotionImageFrame({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 1, opacity: 0.98 }}
      whileHover={{ scale: 1.01, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {/* slight image pop on hover */}
      <motion.div
        className="h-full w-full"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function MotionCTA({
  href,
  label,
  children,
}: React.PropsWithChildren<{ href: string; label: string }>) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      aria-label={label}
      className="group/btn relative block overflow-hidden px-8 pt-2 md:py-4 rounded-md bg-primary text-center font-semibold text-black"
      initial={{ y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
      {/* sweep shine */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1, x: "100%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </motion.a>
  );
}
