"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image from "next/image";
import AnimatedTitle from "./animation/animated-title";
import { getIntroImageClipPath, getFullScreenPath } from "@/lib/utils";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Intro() {
  const windowDimensions = useWindowDimensions();
  const pinnedElementRef = useRef<HTMLDivElement>(null);
  const introImageContainerRef = useRef<HTMLDivElement>(null);
  const introImageBorderPathRef = useRef<SVGPathElement>(null);
  const introImageContentRef = useRef<HTMLImageElement>(null);
  const stonesImageContentRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const pinnedElement = pinnedElementRef.current;
    const introImageContainer = introImageContainerRef.current;
    const stonesImageContent = stonesImageContentRef.current;

    if (!pinnedElement || !introImageContainer || !stonesImageContent) return;

    gsap.set(introImageContainer, {
      y: "25%",
    });

    gsap.set(stonesImageContent, {
      autoAlpha: 0,
      scale: 1.3,
    });

    gsap
      .timeline({
        defaults: { duration: 1, ease: "power1.out" },
        scrollTrigger: {
          trigger: pinnedElement,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      })
      .fromTo(
        introImageContainer,
        { y: "25%" },
        {
          y: 0,
        },
        0,
      )
      .fromTo(
        stonesImageContent,
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
      const pinnedElement = pinnedElementRef.current;
      const introImageContainer = introImageContainerRef.current;
      const introImageContent = introImageContentRef.current;
      const introImageBorderPath = introImageBorderPathRef.current;
      const stonesImageContent = stonesImageContentRef.current;

      if (
        !pinnedElement ||
        !introImageContainer ||
        !introImageContent ||
        !introImageBorderPath ||
        !stonesImageContent
      )
        return;

      const imageClipPath = getIntroImageClipPath(windowDimensions);
      const fullScreenClipPath = getFullScreenPath(windowDimensions);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: pinnedElement,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: true,
            onLeave: () => {
              gsap.set(introImageBorderPath, {
                display: "none",
              });
              gsap.set(pinnedElement, {
                backgroundColor: "black",
              });
            },
            onEnterBack: () => {
              gsap.set(introImageBorderPath, {
                display: "block",
              });
              gsap.set(pinnedElement, {
                backgroundColor: "unset",
              });
            },
          },
        })
        .fromTo(
          introImageContainer,
          {
            clipPath: `path("${imageClipPath}")`,
          },
          {
            clipPath: `path("${fullScreenClipPath}")`,
          },
        )
        .fromTo(
          introImageBorderPath,
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
        .fromTo(introImageContent, { scale: 1.2 }, { scale: 1 }, 0)
        .fromTo(stonesImageContent, { scale: 1.2 }, { scale: 1 }, 0);
    },
    { dependencies: [windowDimensions], revertOnUpdate: true },
  );

  useGSAP((_context, contextSafe) => {
    const controller = new AbortController();
    const introImageContainer = introImageContainerRef.current;
    const introImageContent = introImageContentRef.current;
    const stonesImageContent = stonesImageContentRef.current;

    if (
      !introImageContainer ||
      !introImageContent ||
      !stonesImageContent ||
      !contextSafe
    )
      return;

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
      const introImageContentRect = getElementReact(introImageContent);

      const centerX =
        introImageContentRect.left + introImageContentRect.width / 2;
      const centerY =
        introImageContentRect.top + introImageContentRect.height / 2;

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

      gsap.to(introImageContainer, {
        rotateX,
        rotateY,
      });

      gsap.to(introImageContent, {
        translateX,
        translateY,
        rotateX: -rotateX,
        rotateY: -rotateY,
      });

      gsap.to(stonesImageContent, {
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
    <section className="pt-16 sm:pt-24 lg:pt-32">
      <AnimatedTitle
        titleLrg="Disc<b>o</b>ver the world's<br />largest shared <b>a</b>dventure"
        titleSml="Disc<b>o</b>ver the<br />world's largest<br />shared <b>a</b>dventure"
        caption="Welcom to Zentry"
        containerClassName="text-black"
      />

      <div
        id="pinned-intro-element"
        ref={pinnedElementRef}
        className="relative flex size-full min-h-screen w-full flex-col items-center gap-5 overflow-hidden"
      >
        <div
          ref={introImageContainerRef}
          className="absolute left-0 top-0 z-10 size-full"
          style={{
            clipPath: 'path("")',
            transform: "perspective(100px)",
            willChange: "transform",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            stroke="#000000"
            strokeWidth="2"
            fill="none"
            className="absolute left-0 top-0 z-10 size-full fill-none"
          >
            <path
              ref={introImageBorderPathRef}
              className="absolute left-0 top-0 z-10 size-full fill-none"
              d=""
            ></path>
          </svg>
          <div
            ref={introImageContentRef}
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
            ref={stonesImageContentRef}
            className="absolute left-0 top-0 size-full"
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

        <div className="font-roobert absolute bottom-16 flex w-full flex-col items-center justify-end text-center text-body-desktop/[1.2] tracking-tight">
          <p>The Metagame begins—your life, now an epic MMORPG</p>
          <p className="text-black/50">
            Zentry is the unified play layer that bridges players, agentic AI,
            and
            <br />
            blockchains, creating a new economic paradigm.
          </p>
        </div>
      </div>
    </section>
  );
}
