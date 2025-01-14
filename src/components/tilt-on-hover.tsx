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

      const tiltX = (relativeY - 0.5) * 5;
      const tiltY = (relativeX - 0.5) * -5;

      gsap.to(tiltItem, {
        transform: `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(0.95)`,
      });
    });

    const handleMouseLeave = contextSafe(() => {
      gsap.to(tiltItem, {
        transform: `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`,
      });
    });

    tiltItem.addEventListener("mousemove", handleMouseMove);
    tiltItem.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tiltItem.removeEventListener("mousemove", handleMouseMove);
      tiltItem.removeEventListener("mouseleave", handleMouseLeave);
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
