"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ReactNode, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function TiltOnHover({
  onMouseEnter,
  onMouseLeave,
  className,
  children,
}: {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const tiltItemRef = useRef<HTMLDivElement>(null);

  useGSAP((_context, contextSafe) => {
    const controller = new AbortController();
    const tiltItem = tiltItemRef.current;

    if (!tiltItem || !contextSafe) return;

    gsap.set(tiltItem, {
      transform: `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`,
    });

    function getTiltItemReact() {
      return tiltItem!.getBoundingClientRect();
    }

    const handleMouseMove = contextSafe((e: MouseEvent) => {
      const tiltItemRect = getTiltItemReact();
      const relativeX = (e.clientX - tiltItemRect.left) / tiltItemRect.width;
      const relativeY = (e.clientY - tiltItemRect.top) / tiltItemRect.height;

      const tiltIntensity = 5;

      const tiltX = (relativeY - 0.5) * tiltIntensity;
      const tiltY = (relativeX - 0.5) * -tiltIntensity;

      gsap.to(tiltItem, {
        transform: `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(0.95)`,
      });
    });

    const handleMouseLeave = contextSafe(() => {
      gsap.to(tiltItem, {
        transform: `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`,
      });
    });

    tiltItem.addEventListener("mousemove", handleMouseMove, {
      signal: controller.signal,
    });
    tiltItem.addEventListener("mouseleave", handleMouseLeave, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  });

  return (
    <div
      ref={tiltItemRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
