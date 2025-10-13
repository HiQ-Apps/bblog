"use client";

import { useEffect, useRef } from "react";

type AdUnitProps = {
  slot: string; // AdSense slot ID
  client?: string; // defaults to your pub id
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties; // reserve space to reduce CLS
};

export default function AdUnit({
  slot,
  client = "ca-pub-3628542699195263",
  format = "auto",
  fullWidthResponsive = true,
  className,
  style,
}: AdUnitProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (e) {
      console.warn("AdSense push error:", e);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
