"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const topLogoRef = useRef<SVGSVGElement>(null);
  const bottomLogoRef = useRef<SVGSVGElement>(null);
  const polygonRef = useRef<SVGPolygonElement>(null);

  useGSAP(() => {
    const preloader = preloaderRef.current;
    const topLogo = topLogoRef.current;
    const bottomLogo = bottomLogoRef.current;
    const polygon = polygonRef.current;

    if (!preloader || !topLogo || !bottomLogo || !polygon) return;

    const primaryColor = `hsl(${getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim()
      .split(" ")
      .join(", ")})`;

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
        polygon,
        { rotate: "45deg" },
        {
          duration: 1,
          ease: "power1.out",
          rotate: 0,
          attr: {
            points: "0.2,0.4 0.4,0.05 0.95,0.35 0.3,0.95",
          },
        },
        "<-=0.1",
      )
      .to(
        polygon,

        {
          duration: 0.5,
          attr: {
            points: "0,0 1,0 1,1 0,1",
          },
        },
        ">",
      )
      .then(() => {
        gsap.to(preloader, { autoAlpha: 0 });
        window.scrollTo(0, 0);
        document.body.classList.remove("overflow-hidden");
      });
  });

  return (
    <>
      <svg width="0" height="0" viewBox="0 0 1 1">
        <defs>
          <mask id="diamond-mask" maskContentUnits="objectBoundingBox">
            <rect width="1" height="1" fill="white" />
            <polygon
              ref={polygonRef}
              points="0.5,0.5 0.5,0.5 0.5,0.5 0.5,0.5"
              fill="black"
            />
          </mask>
        </defs>
      </svg>
      <div
        ref={preloaderRef}
        className="special-font fixed inset-0 z-[60] flex min-h-screen w-full flex-col overflow-hidden bg-black font-zentry text-[clamp(1rem,10vw+2rem,10rem)] uppercase text-primary-foreground"
        style={{
          mask: "url(#diamond-mask)",
        }}
      >
        <svg
          ref={topLogoRef}
          aria-hidden="true"
          viewBox="0 0 660 660"
          className="absolute -left-[30vw] top-1/2 size-1/5 -translate-y-1/2 fill-primary"
        >
          <path d="m338.88,214.91H0L617.26,0l-246.08,384.58-32.32-169.69.02.02Z" />
        </svg>
        <svg
          ref={bottomLogoRef}
          aria-hidden="true"
          viewBox="0 0 660 660"
          className="absolute -right-[30vw] top-1/2 size-1/5 translate-y-[-50%] fill-primary"
        >
          <path d="m321.14,444.52h338.87L42.75,659.99l246.07-385.58,32.32,170.13v-.02Z" />
        </svg>
      </div>
    </>
  );
}
