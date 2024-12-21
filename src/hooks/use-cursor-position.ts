"use client";

import { useEffect, useState } from "react";
import useWindowDimensions from "./use-window-dimensions";

export default function useCursorPosition() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setCursorPosition({
        x: (e.clientX / windowDimensions.width) * 2 - 1,
        y: (e.clientY / windowDimensions.height) * 2 - 1,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [windowDimensions]);

  return cursorPosition;
}
