"use client";

import { useEffect, useState } from "react";

export default function useScrolledToTop() {
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    function handleScroll() {
      setIsScrolledToTop(window.scrollY === 0);
    }

    window.addEventListener("scroll", handleScroll, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, []);
  return isScrolledToTop;
}
