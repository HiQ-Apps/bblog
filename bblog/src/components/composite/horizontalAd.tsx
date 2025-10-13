"use client";

import AdUnit from "./adUnit";

type HorizontalAdProps = {
  slot?: string;
  className?: string;
  reserveHeight?: number; // e.g. 280–320 for banner area
};

export default function HorizontalAd({
  slot = "7209350376",
  className,
  reserveHeight = 300,
}: HorizontalAdProps) {
  return (
    <AdUnit
      slot={slot}
      format="auto"
      className={className}
      style={{ minHeight: reserveHeight }}
    />
  );
}
