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
  const clipPathContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageBorderPathRef = useRef<SVGPathElement>(null);
  const imageContentWrapperRef = useRef<HTMLImageElement>(null);
  const stonesImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageClipPath(getAboutImageClipPath(windowDimensions));
    setFullScreenClipPath(getFullScreenClipPath(windowDimensions));
  }, [windowDimensions]);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: clipPathContainerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: true,
            onLeave: () => {
              gsap.set(imageBorderPathRef.current, {
                display: "none",
              });
            },
            onEnterBack: () => {
              gsap.set(imageBorderPathRef.current, {
                display: "block",
              });
            },
          },
        })
        .fromTo(
          imageContainerRef.current,
          {
            clipPath: `path("${imageClipPath}")`,
          },
          {
            clipPath: `path("${fullScreenClipPath}")`,
            ease: "power1.inOut",
          },
        )
        .fromTo(
          imageBorderPathRef.current,
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
          imageContentWrapperRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power1.inOut" },
          0,
        )
        .fromTo(
          stonesImageRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power1.inOut" },
          0,
        );
    },
    { dependencies: [imageClipPath, fullScreenClipPath], revertOnUpdate: true },
  );

  return (
    <div className="mt-32">
      <div className="flex flex-col items-center justify-center">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClassName="mt-5 text-black"
        />
      </div>

      <div
        ref={clipPathContainerRef}
        className="relative flex size-full min-h-dvh w-screen flex-col items-center gap-5 overflow-hidden pb-16"
      >
        <div
          ref={imageContainerRef}
          className="absolute left-0 top-0 z-10 size-full"
          style={{
            clipPath: `path("${imageClipPath}")`,
          }}
        >
          <svg
            className="absolute left-0 top-0 z-10 size-full fill-none"
            stroke={"#000000"}
            strokeWidth="2"
            fill="none"
          >
            <path
              ref={imageBorderPathRef}
              className="absolute left-0 top-0 z-10 size-full fill-none"
              d={imageClipPath}
            ></path>
          </svg>
          <div
            ref={imageContentWrapperRef}
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

        <div className="absolute left-0 top-0 z-10 size-full">
          <div
            ref={stonesImageRef}
            className="absolute left-0 top-0 size-full"
            style={{ scale: 1.2 }}
          >
            <Image
              src="/img/stones.webp"
              alt="background"
              fill
              sizes="100vw"
              className="absolute left-0 top-0 size-full object-cover"
            />
          </div>
        </div>

        <div className="flex h-full flex-col items-center justify-end text-center font-circular-web text-lg leading-tight tracking-tight">
          <p>The Game of Games begins&mdash;your life, now and epic MMORPG</p>
          <p className="text-black/40">
            Zentry unites every player from countless games and platforms,
            <br /> both digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>
    </div>
  );
}
