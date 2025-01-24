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
  const imageClipPathRef = useRef<HTMLDivElement>(null);
  const imageBorderPathRef = useRef<SVGPathElement>(null);
  const imageContentRef = useRef<HTMLImageElement>(null);
  const stonesImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageClipPath(getIntroImageClipPath(windowDimensions));
    setFullScreenClipPath(getFullScreenClipPath(windowDimensions));
  }, [windowDimensions]);

  useGSAP(() => {
    gsap.set(imageClipPathRef.current, {
      y: "25%",
    });

    gsap.set(stonesImageRef.current, {
      autoAlpha: 0,
      scale: 1.3,
    });

    gsap
      .timeline({
        defaults: { duration: 1, ease: "power1.out" },
        scrollTrigger: {
          trigger: pinnedElementRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      })
      .fromTo(
        imageClipPathRef.current,
        { y: "25%" },
        {
          y: 0,
        },
        0,
      )
      .fromTo(
        stonesImageRef.current,
        {
          autoAlpha: 0,
          scale: 1.3,
        },
        {
          autoAlpha: 1,
          scale: 1.2,
        },
        0,
      );
  });

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
            },
            onEnterBack: () => {
              gsap.set(imageBorderPathRef.current, {
                display: "block",
              });
              gsap.set(pinnedElementRef.current, {
                backgroundColor: "unset",
              });
            },
          },
        })
        .fromTo(
          imageClipPathRef.current,
          {
            clipPath: `path("${imageClipPath}")`,
          },
          {
            clipPath: `path("${fullScreenClipPath}")`,
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
          },
          0,
        )
        .fromTo(imageContentRef.current, { scale: 1.2 }, { scale: 1 }, 0)
        .fromTo(stonesImageRef.current, { scale: 1.2 }, { scale: 1 }, 0);
    },
    { dependencies: [imageClipPath, fullScreenClipPath], revertOnUpdate: true },
  );

  useGSAP((_context, contextSafe) => {
    const controller = new AbortController();
    const imageClipPath = imageClipPathRef.current;
    const imageContent = imageContentRef.current;
    const stonesImage = stonesImageRef.current;

    if (!imageClipPath || !imageContent || !stonesImage || !contextSafe) return;

    function getElementReact(element: HTMLElement) {
      return element.getBoundingClientRect();
    }

    const maxRotateIntensity = 3;
    let rotateIntensity = maxRotateIntensity;

    const maxTranslateIntensity = 0.02;
    let translateIntensity = maxTranslateIntensity;

    ScrollTrigger.create({
      trigger: pinnedElementRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        rotateIntensity = Math.max(
          maxRotateIntensity * (1 - self.progress * 1.5),
          0,
        );
        translateIntensity = Math.max(
          maxTranslateIntensity * (1 - self.progress * 1.5),
          0,
        );
      },
    });

    const cursor = { x: 0, y: 0 };

    const handleTransform = contextSafe(() => {
      const imageContentRect = getElementReact(imageContent);

      const centerX = imageContentRect.left + imageContentRect.width / 2;
      const centerY = imageContentRect.top + imageContentRect.height / 2;

      const translateOffsetX = cursor.x - centerX; // Horizontal offset from element center
      const translateOffsetY = cursor.y - centerY; // Vertical offset from element center

      const translateX = translateOffsetX * translateIntensity;
      const translateY = translateOffsetY * translateIntensity;

      const relativeX = cursor.x / window.innerWidth; // Horizontal position (0 to 1)
      const relativeY = cursor.y / window.innerHeight; // Vertical position (0 to 1)

      const rotateOffsetX = relativeX - 0.5; // Horizontal offset (-0.5 to 0.5)
      const rotateOffsetY = relativeY - 0.5; // Vertical offset (-0.5 to 0.5)

      const rotateX = rotateOffsetY * -rotateIntensity; // Vertical tilt
      const rotateY = rotateOffsetX * rotateIntensity; // Horizontal tilt

      gsap.to(imageClipPath, {
        rotateX,
        rotateY,
      });

      gsap.to(imageContent, {
        translateX,
        translateY,
        rotateX: -rotateX,
        rotateY: -rotateY,
      });

      gsap.to(stonesImage, {
        translateX,
        translateY,
      });
    });

    window.addEventListener(
      "mousemove",
      (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;

        handleTransform();
      },
      {
        signal: controller.signal,
      },
    );

    window.addEventListener(
      "scroll",
      () => {
        handleTransform();
      },
      {
        signal: controller.signal,
      },
    );

    return () => controller.abort();
  });

  return (
    <section className="mt-16 sm:mt-[7.5rem]">
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
          ref={imageClipPathRef}
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
          <div ref={stonesImageRef} className="absolute left-0 top-0 size-full">
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
