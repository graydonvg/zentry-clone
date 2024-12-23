import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  titleLrg: string;
  titleSml: string;
  containerClassName?: string;
};

const AnimatedTitle = forwardRef<HTMLDivElement, Props>(
  ({ titleLrg, titleSml, containerClassName }, ref) => {
    useGSAP(() => {
      if (!ref || typeof ref !== "object" || ref.current === null) return;

      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "50% bottom",
          toggleActions: "play none none reverse",
        },
      });

      titleAnimation.to("h2", {
        transform: "translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
        ease: "power2.out",
        duration: 1,
      });

      titleAnimation.to(
        ".animated-word",
        {
          opacity: 1,
          duration: 0,
          stagger: 0.065,
        },
        0,
      );
    });

    return (
      <div
        ref={ref}
        style={{
          perspective: 1000,
        }}
      >
        <h2
          className={cn(
            "hidden flex-col gap-1 text-[clamp(2.5rem,6.3vw,7.5rem)] uppercase leading-[.8] text-white sm:flex sm:px-32",
            containerClassName,
          )}
          style={{
            transform:
              "translate3d(-107.977px, 51.303px, -59.3966px) rotateY(-50deg) rotateX(-20deg)",
            transformOrigin: "50% 50% -150px",
          }}
        >
          {titleLrg.split("<br />").map((line, index) => (
            <div
              key={index}
              className="flex-center max-w-full flex-wrap gap-2 md:gap-3"
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
        </h2>
        <h2
          className={cn(
            "flex flex-col gap-1 text-[clamp(1.5rem,12.6vw,7.5rem)] uppercase leading-[.8] text-white sm:hidden sm:px-32",
            containerClassName,
          )}
        >
          {titleSml.split("<br />").map((line, index) => (
            <div key={index} className="flex-center max-w-full flex-wrap px-4">
              {line.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="animated-word special-font mr-2 font-zentry font-black opacity-0"
                  dangerouslySetInnerHTML={{ __html: word }}
                />
              ))}
            </div>
          ))}
        </h2>
      </div>
    );
  },
);

AnimatedTitle.displayName = "AnimatedTitle";

export default AnimatedTitle;
