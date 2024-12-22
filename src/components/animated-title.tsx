import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  title: string;
  containerClassName?: string;
};

export default function AnimatedTitle({ title, containerClassName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const titleAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "100 bottom",
        end: "center bottom",
        toggleActions: "play none none reverse",
      },
    });

    titleAnimation.to(".animated-word", {
      opacity: 1,
      transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
      ease: "power2.inOut",
      stagger: 0.02,
    });
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-1 text-[clamp(14px,6.3vw,120px)] uppercase leading-[.8] text-white sm:px-32",
        containerClassName,
      )}
    >
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {line.split(" ").map((word, index) => (
            <span
              key={index}
              className="animated-word special-font font-zentry font-black opacity-0"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
