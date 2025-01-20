"use client";

import { useEffect, useState } from "react";
import useWindowDimensions from "./use-window-dimensions";

export default function useCursorPosition() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    const controller = new AbortController();

    function handleMouseMove(e: MouseEvent) {
      setCursorPosition({
        x: (e.clientX / windowDimensions.width) * 2 - 1,
        y: (e.clientY / windowDimensions.height) * 2 - 1,
      });
    }

    window.addEventListener("mousemove", handleMouseMove, {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [windowDimensions]);

  return cursorPosition;
}
