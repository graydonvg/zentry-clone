"use client";

import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const measurementElement =
    typeof window !== "undefined"
      ? document.getElementById("measurement-element")
      : null;
  const viewportHeight =
    measurementElement?.getBoundingClientRect().height ?? 0;
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: viewportHeight,
  });

  useEffect(() => {
    const controller = new AbortController();

    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: viewportHeight,
      });
    }

    window.addEventListener("resize", handleResize, {
      signal: controller.signal,
    });
    handleResize(); // Call on mount to ensure state is updated with the initial size.

    return () => controller.abort();
  }, [viewportHeight]);

  return windowDimensions;
}
