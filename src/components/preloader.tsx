"use client";

import useAssetsStore from "@/lib/store/use-assets-store";
import { useEffect } from "react";

export default function Preloader() {
  const heroVideoAssetsLoaded = useAssetsStore(
    (state) => state.heroVideoAssetsLoaded,
  );

  useEffect(() => {
    if (!heroVideoAssetsLoaded) {
      window.scrollTo(0, 0);
      document.body.classList.add("overflow-hidden");
    }

    if (heroVideoAssetsLoaded) {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [heroVideoAssetsLoaded]);

  return (
    <>
      {!heroVideoAssetsLoaded && (
        <div className="special-font fixed inset-0 z-[60] flex min-h-screen w-full flex-col items-center justify-center bg-violet-300 font-zentry text-[clamp(1rem,10vw+2rem,10rem)] uppercase text-white">
          <span>
            Lo<b>a</b>ding...
          </span>
        </div>
      )}
    </>
  );
}
