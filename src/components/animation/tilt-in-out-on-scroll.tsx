import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type Props = {
  containerClassName?: string;
  children: ReactNode;
};

export default function TiltInOutOnScroll({
  containerClassName,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const pinnedIntroElement = document.getElementById("pinned-intro-element");
    const pinnedIntroElementHeight = pinnedIntroElement?.clientHeight;
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    if (!container || !wrapper || !pinnedIntroElementHeight) return;

    gsap.set(wrapper, {
      opacity: 0,
      transform: "perspective(1000px) translateY(100px) rotateX(-40deg)",
      transformOrigin: "center top",
    });

    gsap.fromTo(
      wrapper,
      {
        opacity: 0,
        transform: "perspective(1000px) translateY(100px) rotateX(-40deg)",
      },
      {
        opacity: 1,
        transform: "perspective(1000px) translateY(0px) rotateX(0deg)",
        scrollTrigger: {
          trigger: container,
          start: () => `top+=${pinnedIntroElementHeight + 80} bottom`,
          end: () => `bottom+=${pinnedIntroElementHeight} bottom`,
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  return (
    <div ref={containerRef} className={containerClassName}>
      <div ref={wrapperRef} className="size-full">
        {children}
      </div>
    </div>
  );
}
