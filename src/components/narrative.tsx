"use client";

import Image from "next/image";
import AnimatedTitle from "./animation/animated-title";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import RoundedCorners from "./rounded-corners";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Narrative() {
  const pinnedIntroElement =
    typeof window !== "undefined"
      ? document.getElementById("pinned-intro-element")
      : null;
  const pinnedIntroElementHeight = pinnedIntroElement?.clientHeight ?? 0;
  const imageClipPathRef = useRef<HTMLDivElement>(null);
  const imageContentRef = useRef<HTMLDivElement>(null);

  useGSAP((_context, contextSafe) => {
    const imageClipPath = imageClipPathRef.current;
    const imageContent = imageContentRef.current;

    if (!imageClipPath || !imageContent || !contextSafe) return;

    function getElementReact(element: HTMLElement) {
      return element.getBoundingClientRect();
    }

    const handleMouseMove = contextSafe((e: MouseEvent) => {
      const imageClipPathRect = getElementReact(imageClipPath);

      const relativeX =
        (e.clientX - imageClipPathRect.left) / imageClipPathRect.width;
      const relativeY =
        (e.clientY - imageClipPathRect.top) / imageClipPathRect.height;

      const tiltIntensity = 2;

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
  });

  return (
    <section
      id="narrative"
      className="relative flex size-full min-h-screen flex-col items-center overflow-hidden bg-black pt-10 text-blue-50"
    >
      <AnimatedTitle
        caption="the open ip universe"
        titleLrg="the st<b>o</b>ry of<br />a hidden real<b>m</b>"
        titleSml="the st<b>o</b>ry of<br />a hidden real<b>m</b>"
        scrollTriggerOffset={pinnedIntroElementHeight}
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
    </section>
  );
}
