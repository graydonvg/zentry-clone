"use client";

import { useEffect, useState } from "react";

export default function useScrolledToTop() {
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  useEffect(() => {
    function handleScroll() {
      setIsScrolledToTop(window.scrollY === 0);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return isScrolledToTop;
}
