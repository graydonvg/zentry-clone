"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image from "next/image";
import AnimatedTitle from "./animated-title";
import { getAboutImageClipPath, getFullScreenClipPath } from "@/lib/utils";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function About() {
  const windowDimensions = useWindowDimensions();
  const [imageClipPath, setImageClipPath] = useState("");
  const [fullScreenClipPath, setFullScreenClipPath] = useState("");
  const aboutContainer = useRef<HTMLDivElement>(null);
  const imageConatinerRef = useRef<HTMLDivElement>(null);
  const imageBorderRef = useRef<SVGPathElement>(null);
  const imageWrapperRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageClipPath(getAboutImageClipPath(windowDimensions));
    setFullScreenClipPath(getFullScreenClipPath(windowDimensions));
  }, [windowDimensions]);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: aboutContainer.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: true,
            onLeave: () => {
              gsap.set(imageBorderRef.current, {
                display: "none",
              });
            },
            onEnterBack: () => {
              gsap.set(imageBorderRef.current, {
                display: "block",
              });
            },
          },
        })
        .fromTo(
          imageConatinerRef.current,
          {
            clipPath: `path("${imageClipPath}")`,
          },
          {
            clipPath: `path("${fullScreenClipPath}")`,
            ease: "power1.inOut",
          },
        )
        .fromTo(
          imageBorderRef.current,
          {
            attr: {
              d: imageClipPath,
            },
          },
          {
            attr: {
              d: fullScreenClipPath,
            },
            ease: "power1.inOut",
          },
          0,
        )
        .fromTo(
          imageWrapperRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power1.inOut" },
          0,
        );
    },
    { dependencies: [imageClipPath, fullScreenClipPath], revertOnUpdate: true },
  );

  return (
    <div
      ref={aboutContainer}
      className="relative mt-36 flex size-full min-h-dvh w-screen flex-col items-center gap-5"
    >
      <p className="font-general text-sm uppercase md:text-[10px]">
        Welcome to Zentry
      </p>

      <AnimatedTitle
        title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
        containerClassName="mt-5 !text-black text-center"
      />

      <div
        ref={imageConatinerRef}
        className="absolute left-0 top-0 z-50 size-full"
        style={{
          clipPath: `path("${imageClipPath}")`,
        }}
      >
        <svg
          className="absolute left-0 top-0 z-50 size-full fill-none"
          stroke={"#000000"}
          strokeWidth="2"
          fill="none"
        >
          <path
            ref={imageBorderRef}
            className="absolute left-0 top-0 z-50 size-full fill-none"
            d={imageClipPath}
          ></path>
        </svg>
        <div
          ref={imageWrapperRef}
          className="absolute left-0 top-0 size-full"
          style={{ scale: 1.2 }}
        >
          <Image
            src="/img/about.webp"
            alt="background"
            fill
            sizes="100vw"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>

      <div className="absolute left-0 top-0 z-50 size-full">
        <div className="absolute left-0 top-0 size-full">
          <Image
            src="/img/stones.webp"
            alt="background"
            fill
            sizes="100vw"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 w-full max-w-96 -translate-x-1/2 text-center font-circular-web text-lg leading-tight tracking-tight md:max-w-[34rem]">
        <p>The Game of Games begins&mdash;your life, now and epic MMORPG</p>
        <p className="text-black/40">
          Zentry unites every player from countless games and platforms,
          <br /> both digital and physical, into a unified Play Economy
        </p>
      </div>
    </div>
  );
}
