"use client";

import useAssetsStore from "@/lib/store/use-assets-store";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Preloader() {
  const heroVideoAssetsLoaded = useAssetsStore(
    (state) => state.heroVideoAssetsLoaded,
  );

  useGSAP(() => {
    if (heroVideoAssetsLoaded) {
      gsap.to("#preloader", { autoAlpha: 0 });
      document.body.classList.remove("overflow-hidden");
    }
  }, [heroVideoAssetsLoaded]);

  return (
    <div
      id="preloader"
      className="special-font fixed inset-0 z-[60] flex min-h-screen w-full flex-col items-center justify-center bg-primary font-zentry text-[clamp(1rem,10vw+2rem,10rem)] uppercase text-primary-foreground"
    >
      <span>
        Lo<b>a</b>ding...
      </span>
    </div>
  );
}
