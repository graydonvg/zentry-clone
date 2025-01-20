"use client";

import { useEffect, useRef, useState } from "react";

export default function useMouseMoving() {
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    function handleMouseMove() {
      setIsMouseMoving(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 300);
    }

    window.addEventListener("mousemove", handleMouseMove, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isMouseMoving;
}
