"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image from "next/image";
import AnimatedTitle from "./animation/animated-title";
import { getIntroImageClipPath, getFullScreenClipPath } from "@/lib/utils";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Intro() {
  const windowDimensions = useWindowDimensions();
  const [imageClipPath, setImageClipPath] = useState("");
  const [fullScreenClipPath, setFullScreenClipPath] = useState("");
  const pinnedElementRef = useRef<HTMLDivElement>(null);
  const imageClipPathPathRef = useRef<HTMLDivElement>(null);
  const imageBorderPathRef = useRef<SVGPathElement>(null);
  const imageContentRef = useRef<HTMLImageElement>(null);
  const stonesImageRef = useRef<HTMLImageElement>(null);
  const [allowTilt, setAllowTilt] = useState(true);

  useEffect(() => {
    setImageClipPath(getIntroImageClipPath(windowDimensions));
    setFullScreenClipPath(getFullScreenClipPath(windowDimensions));
  }, [windowDimensions]);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: pinnedElementRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: true,
            onLeave: () => {
              gsap.set(imageBorderPathRef.current, {
                display: "none",
              });
              gsap.set(pinnedElementRef.current, {
                backgroundColor: "black",
              });
              setAllowTilt(false);
            },
            onEnterBack: () => {
              gsap.set(imageBorderPathRef.current, {
                display: "block",
              });
              gsap.set(pinnedElementRef.current, {
                backgroundColor: "unset",
              });
              setAllowTilt(true);
            },
          },
        })
        .fromTo(
          imageClipPathPathRef.current,
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
          imageContentRef.current,
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

  useGSAP(
    (_context, contextSafe) => {
      if (!allowTilt) return;

      const imageClipPath = imageClipPathPathRef.current;
      const imageContent = imageContentRef.current;
      const stonesImage = stonesImageRef.current;

      if (!imageClipPath || !imageContent || !stonesImage || !contextSafe)
        return;

      function getElementReact(element: HTMLElement) {
        return element.getBoundingClientRect();
      }

      const maxTiltIntensity = 3;
      let tiltIntensity = maxTiltIntensity;

      const maxTranslateIntensity = 0.02;
      let translateIntensity = maxTranslateIntensity;

      ScrollTrigger.create({
        trigger: pinnedElementRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          tiltIntensity = maxTiltIntensity * (1 - self.progress);
          translateIntensity = maxTranslateIntensity * (1 - self.progress);
        },
      });

      const handleMouseMove = contextSafe((e: MouseEvent) => {
        const imageClipPathRect = getElementReact(imageClipPath);
        const imageContentRect = getElementReact(imageContent);

        const centerX = imageContentRect.left + imageContentRect.width / 2;
        const centerY = imageContentRect.top + imageContentRect.height / 2;

        const translateX = (e.clientX - centerX) * translateIntensity;
        const translateY = (e.clientY - centerY) * translateIntensity;

        gsap.to(imageContent, {
          translateX,
          translateY,
        });

        gsap.to(stonesImage, {
          translateX,
          translateY,
        });

        const relativeX =
          (e.clientX - imageClipPathRect.left) / imageClipPathRect.width;
        const relativeY =
          (e.clientY - imageClipPathRect.top) / imageClipPathRect.height;

        const tiltX = (relativeY - 0.5) * -tiltIntensity;
        const tiltY = (relativeX - 0.5) * tiltIntensity;

        gsap.to(imageClipPath, {
          rotateX: tiltX,
          rotateY: tiltY,
        });

        gsap.to(imageContent, {
          rotateY: -tiltY,
          rotateX: -tiltX,
        });
      });

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { dependencies: [allowTilt], revertOnUpdate: true },
  );

  return (
    <section id="intro" className="mt-16 sm:mt-[7.5rem]">
      <AnimatedTitle
        titleLrg="Disc<b>o</b>ver the world's<br />largest shared <b>a</b>dventure"
        titleSml="Disc<b>o</b>ver the<br />world's largest<br />shared <b>a</b>dventure"
        caption="Welcom to Zentry"
        containerClassName="text-black"
      />

      <div
        id="pinned-intro-element"
        ref={pinnedElementRef}
        className="relative flex size-full min-h-screen w-full flex-col items-center gap-5 overflow-hidden pb-16"
      >
        <div
          ref={imageClipPathPathRef}
          className="absolute left-0 top-0 z-10 size-full"
          style={{
            clipPath: `path("${imageClipPath}")`,
            transform: "perspective(100px)",
            willChange: "transform",
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
            ref={imageContentRef}
            className="absolute left-0 top-0 size-full"
            style={{
              scale: 1.2,
              transform: "perspective(100px)",
              willChange: "transform",
            }}
          >
            <Image
              src="/img/intro.webp"
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

        <div className="absolute bottom-16 flex w-full flex-col items-center justify-end text-center font-circular-web text-[clamp(0.5rem,3vw,1rem)] leading-tight tracking-tight">
          <p>The Game of Games begins&mdash;your life, now and epic MMORPG</p>
          <p className="text-black/40">
            Zentry unites every player from countless games and platforms,
            <br /> both digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>
    </section>
  );
}
