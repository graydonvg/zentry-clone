"use client";

import usePreloaderStore from "@/lib/store/use-preloader-store";
import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const measurementElement =
    typeof window !== "undefined"
      ? document.getElementById("measurement-element")
      : null;
  const viewportHeight =
    measurementElement?.getBoundingClientRect().height ?? 0;
  const viewportWidth = measurementElement?.getBoundingClientRect().width ?? 0;
  const [windowDimensions, setWindowDimensions] = useState({
    width: viewportWidth,
    height: viewportHeight,
  });
  const { isPreloaderComplete } = usePreloaderStore();

  useEffect(() => {
    const controller = new AbortController();

    function handleResize() {
      setWindowDimensions({
        width: viewportWidth,
        height: viewportHeight,
      });
    }

    handleResize();

    window.addEventListener("resize", handleResize, {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [viewportWidth, viewportHeight, isPreloaderComplete]);

  return windowDimensions;
}
