"use client";

import AdUnit from "./AdUnit";

type VerticalAdProps = {
  slot?: string;
  className?: string;
  // e.g. 600 for tall sidebar
  reserveHeight?: number;
};

export default function VerticalAd({
  slot = "7813777616",
  className,
  reserveHeight = 600,
}: VerticalAdProps) {
  return (
    <AdUnit
      slot={slot}
      format="vertical"
      className={className}
      style={{ minHeight: reserveHeight }}
    />
  );
}
