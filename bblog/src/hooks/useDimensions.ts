import { useSyncExternalStore } from "react";

type Size = { width: number; height: number };

// cache the last object so reference stays stable when unchanged
let last: Size = { width: 0, height: 0 };

const getServerSnapshot = (): Size => last;

const getSnapshot = (): Size => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w !== last.width || h !== last.height) {
    last = { width: w, height: h }; // only new object when values changed
  }
  return last; // same reference if no change
};

const subscribe = (onChange: () => void) => {
  let raf = 0;
  const handler = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(onChange);
  };
  window.addEventListener("resize", handler, { passive: true });
  window.addEventListener("orientationchange", handler, { passive: true });
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
  };
};

export default function useWindowSize(): Size {
  return typeof window === "undefined"
    ? getServerSnapshot()
    : useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
