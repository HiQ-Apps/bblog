"use client";

import { useState, useEffect } from "react";

const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on resize/orientation change
    function update() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial values
    update();

    // Listen for events
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return dimensions;
};

export default useDimensions;
