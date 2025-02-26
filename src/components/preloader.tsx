"use client";

import useWindowDimensions from "@/hooks/use-window-dimensions";
import useAssetsStore from "@/lib/store/use-assets-store";
import usePreloaderStore from "@/lib/store/use-preloader-store";
import { getFullScreenPath, getPreloaderMaskPath } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Preloader() {
  const windowDimensions = useWindowDimensions();
  const [initialMaskPath, setInitialMaskPath] = useState("");
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderSvgRef = useRef<SVGSVGElement>(null);
  const topLogoRef = useRef<SVGSVGElement>(null);
  const bottomLogoRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { heroVideoAssetsLoaded } = useAssetsStore();
  const { toggleIsPreloaderComplete } = usePreloaderStore();
  const [preloaderFirstPhaseComplete, setPreloaderFirstPhaseComplete] =
    useState(false);

  useEffect(() => {
    setInitialMaskPath(getPreloaderMaskPath(windowDimensions, true));
  }, [windowDimensions]);

  useGSAP(() => {
    const preloader = preloaderRef.current;
    const topLogo = topLogoRef.current;
    const bottomLogo = bottomLogoRef.current;

    if (!preloader || !topLogo || !bottomLogo) return;

    gsap
      .timeline({
        defaults: { ease: "power1.out" },
      })
      .to(
        bottomLogo,
        {
          scale: 10,
          left: "50%",
          translateX: "-20vw",
        },
        0,
      )
      .to(
        topLogo,
        {
          scale: 10,
          left: "50%",
          translateX: "20vw",
        },
        "<+=0.2",
      )
      .to(
        bottomLogo,
        {
          scale: 1,
          translateX: "-50%",
        },
        "<+=0.2",
      )
      .to(
        topLogo,
        {
          scale: 1,
          translateX: "-50%",
        },
        "<+=0.2",
      )
      .then(() => setPreloaderFirstPhaseComplete(true));
  });

  useGSAP(
    () => {
      if (!heroVideoAssetsLoaded || !preloaderFirstPhaseComplete) return;

      const preloader = preloaderRef.current;
      const preloaderSvg = preloaderSvgRef.current;
      const topLogo = topLogoRef.current;
      const bottomLogo = bottomLogoRef.current;
      const path = pathRef.current;

      if (!preloader || !preloaderSvg || !topLogo || !bottomLogo || !path)
        return;

      const primaryColor = `hsl(${getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()
        .split(" ")
        .join(", ")})`;

      const tl = gsap
        .timeline({
          defaults: { ease: "power1.out" },
        })
        .to(
          bottomLogo,
          {
            ease: "power1.in",
            scale: 100,
            left: "-10vw",
            translateY: "-300vh",
            rotate: "-45deg",
          },
          ">+=0.3",
        )
        .to(
          topLogo,
          {
            ease: "power1.in",
            scale: 100,
            left: "-10vw",
            translateY: "-300vh",
            rotate: "-45deg",
          },
          "<",
        )
        .set(
          preloader,
          {
            backgroundColor: primaryColor,
          },
          ">",
        )
        .to(
          topLogo,
          {
            autoAlpha: 0,
          },
          "<",
        )
        .to(
          bottomLogo,
          {
            autoAlpha: 0,
          },
          "<",
        )
        .fromTo(
          path,
          { rotate: 0 },
          {
            duration: 1,
            ease: "power1.out",
            rotate: "-45deg",
            attr: {
              d: getPreloaderMaskPath(windowDimensions),
            },
          },
          "<-=0.1",
        )
        .fromTo(
          path,
          { rotate: "-45deg" },
          {
            rotate: 0,
            duration: 0.5,
            attr: {
              d: getFullScreenPath(windowDimensions),
            },
          },
          ">",
        )
        .set(preloaderSvg, { display: "none" })
        .to(preloader, { autoAlpha: 0 })
        .fromTo(
          ".hero-heading-enter-preloader",
          {
            display: "none",
            transform:
              "perspective(1000px) translate3d(0px, -100%, -20px) rotateZ(-20deg) rotateX(60deg)",
          },

          {
            display: "block",
            transform:
              "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
          },
          "<-=0.4",
        )
        .fromTo(
          ".hero-heading-chars-enter-preloader",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.01,
            stagger: {
              amount: 0.3,
            },
          },
          "<",
        )
        .fromTo(
          ".hero-cta-enter-preloader",
          {
            autoAlpha: 0,
            translateY: 20,
          },
          {
            autoAlpha: 1,
            translateY: 0,
            stagger: {
              amount: 0.3,
            },
          },
          "<",
        )
        .fromTo(
          "#navbar",
          {
            autoAlpha: 0,
            translateY: -20,
          },
          {
            autoAlpha: 1,
            translateY: 0,
          },
          "<",
        );

      tl.then(() => {
        document.body.classList.remove("overflow-hidden");
      }).then(() => {
        toggleIsPreloaderComplete();
      });

      const controller = new AbortController();

      window.addEventListener(
        "resize",
        () => {
          if (!tl.isActive()) return;

          // Skip to the end of the preloader animation if viewport is resized before animation is complete to avoid responsive issues with mask path.

          tl.seek(tl.duration())
            .then(() => {
              document.body.classList.remove("overflow-hidden");
            })
            .then(() => {
              toggleIsPreloaderComplete();
            });
        },
        { signal: controller.signal },
      );

      return () => controller.abort();
    },
    {
      dependencies: [heroVideoAssetsLoaded, preloaderFirstPhaseComplete],
    },
  );

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[60] size-full min-h-screen bg-black"
      style={{
        mask: "url(#mask)",
      }}
    >
      <svg
        ref={preloaderSvgRef}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width="100%"
        height="100%"
      >
        <defs>
          <mask id="mask">
            <rect width="100%" height="100%" fill="white" />
            <path ref={pathRef} d={initialMaskPath} fill="black" />
          </mask>
        </defs>
      </svg>
      <svg
        ref={topLogoRef}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 661 660"
        className="absolute -left-[30vw] top-1/2 size-1/5 -translate-y-1/2 fill-primary"
      >
        <path d="m338.88,214.91H0L617.26,0l-246.08,384.58-32.32-169.69.02.02Z" />
      </svg>
      <svg
        ref={bottomLogoRef}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        viewBox="0 0 661 660"
        className="absolute -right-[30vw] top-1/2 size-1/5 translate-y-[-50%] fill-primary"
      >
        <path d="m321.14,444.52h338.87L42.75,659.99l246.07-385.58,32.32,170.13v-.02Z" />
      </svg>
    </div>
  );
}
