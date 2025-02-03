"use client";

import Image from "next/image";
import AnimatedTitle from "./animation/animated-title";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import RoundedCorners from "./rounded-corners";
import Button from "./ui/button";
import { defaultLinkToast } from "./ui/toast";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function Narrative() {
  const pinnedIntroElement =
    typeof window !== "undefined"
      ? document.getElementById("pinned-intro-element")
      : null;
  const imageClipPathRef = useRef<HTMLDivElement>(null);
  const imageContentRef = useRef<HTMLDivElement>(null);
  const [scrollTriggerOffset, setScrollTriggerOffset] = useState(
    pinnedIntroElement?.clientHeight ?? 0,
  );

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "resize",
      () => {
        setScrollTriggerOffset(pinnedIntroElement?.clientHeight ?? 0);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [pinnedIntroElement]);

  useGSAP(
    (_context, contextSafe) => {
      const controller = new AbortController();
      const imageClipPath = imageClipPathRef.current;
      const imageContent = imageContentRef.current;

      if (!imageClipPath || !imageContent || !contextSafe) return;

      gsap.set(imageClipPath, {
        translateY: "30%",
      });

      gsap.set(imageContent, {
        translateY: "-30%",
      });

      ScrollTrigger.create({
        trigger: "#narrative-title",
        start: () => `70%+=${scrollTriggerOffset} bottom`,
        end: () => `bottom+=${scrollTriggerOffset} bottom`,
        onEnter: () => {
          gsap.fromTo(
            imageClipPath,
            {
              translateY: "30%",
            },
            {
              translateY: 0,
              duration: 1,
            },
          );

          gsap.fromTo(
            imageContent,
            {
              translateY: "-30%",
            },
            {
              translateY: 0,
              duration: 1,
            },
          );
        },
        onEnterBack: () => {
          gsap.set(imageClipPath, {
            rotateX: 0,
            rotateY: 0,
          });

          gsap.set(imageContent, {
            rotateX: 0,
            rotateY: 0,
          });
        },
        onLeaveBack: () => {
          gsap.to(imageClipPath, {
            translateY: "30%",
          });

          gsap.to(imageContent, {
            translateY: "-30%",
          });
        },
      });

      const rotateIntensity = 2;

      const handleMouseMove = contextSafe((e: MouseEvent) => {
        const relativeX = e.clientX / window.innerWidth; // Horizontal position (0 to 1)
        const relativeY = e.clientY / window.innerHeight; // Vertical position (0 to 1)

        const rotateOffsetX = relativeX - 0.5; // Horizontal offset (-0.5 to 0.5)
        const rotateOffsetY = relativeY - 0.5; // Vertical offset (-0.5 to 0.5)

        const rotateX = rotateOffsetY * -rotateIntensity; // Vertical tilt
        const rotateY = rotateOffsetX * rotateIntensity; // Horizontal tilt

        gsap.to(imageClipPath, {
          rotateX,
          rotateY,
        });

        gsap.to(imageContent, {
          rotateX: -rotateX,
          rotateY: -rotateY,
        });
      });

      window.addEventListener("mousemove", handleMouseMove, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
      };
    },
    { dependencies: [scrollTriggerOffset], revertOnUpdate: true },
  );

  return (
    <section className="relative flex size-full h-fit flex-col items-center overflow-hidden bg-black py-16 text-foreground sm:py-24 lg:py-32">
      <AnimatedTitle
        id="narrative-title"
        caption="the open ip universe"
        titleLrg="the st<b>o</b>ry of<br />a hidden real<b>m</b>"
        titleSml="the st<b>o</b>ry of<br />a hidden real<b>m</b>"
        scrollTriggerOffset={scrollTriggerOffset}
        containerClassName="mix-blend-difference z-10"
      />

      <div
        className="absolute flex h-fit w-full justify-center"
        style={{ filter: "url(#flt_tag)" }}
      >
        <div
          ref={imageClipPathRef}
          className="absolute top-20 aspect-[3/2] w-[90vw] max-w-screen-xl overflow-hidden sm:top-20 md:top-28 md:w-[60vw]"
          style={{
            clipPath: "polygon(0% 0%, 83% 20%, 100% 73%, 10% 100%)",
            transform: "perspective(100px)",
            willChange: "transform",
          }}
        >
          <div
            ref={imageContentRef}
            className="story-img-content absolute inset-0 size-full"
            style={{
              transform: "perspective(100px)",
              willChange: "transform",
            }}
          >
            <Image
              src="/img/entrance.webp"
              alt="entrance"
              fill
              className="scale-[1.5]"
            />
          </div>
        </div>
        <RoundedCorners />
      </div>
      <div className="relative mx-auto mt-[clamp(10rem,50vw+6rem,40rem)] flex w-full max-w-screen-2xl justify-center md:mt-[clamp(16rem,25.5vw+6rem,40rem)] md:w-[72vw] md:justify-end">
        <div className="flex h-full w-fit flex-col items-center gap-8 text-center md:items-start md:text-start">
          <p className="text-body-sm font-medium leading-[1.2] md:text-body-lg">
            Where realms converge, lies Zentry and the
            <br />
            boundless pillar. Discover its secrets and shape
            <br />
            your fate amidst infinite opportunities.
          </p>
          <Button variant="secondary" onClick={() => defaultLinkToast()}>
            discover prologue
          </Button>
        </div>
      </div>
    </section>
  );
}
