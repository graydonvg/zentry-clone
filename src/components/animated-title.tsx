import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, Fragment } from "react";

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

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "50% bottom",
            toggleActions: "play none none reverse",
          },
        })
        .to("h2", {
          transform:
            "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
          ease: "power2.out",
          duration: 1,
        })
        .to(
          ".animated-word",
          {
            opacity: 1,
            duration: 0.01,
            stagger: {
              amount: 0.5,
            },
          },
          0,
        );
    });

    return (
      <div ref={ref}>
        <h2
          className={cn(
            "hidden flex-col gap-1 text-[clamp(2.5rem,6.3vw,7.5rem)] uppercase leading-[.8] text-white sm:flex sm:px-32",
            containerClassName,
          )}
          style={{
            transform:
              "perspective(1000px) translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
            transformOrigin: "50% 50% -150px",
            willChange: "transform",
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
                  style={{ willChange: "opacity" }}
                  dangerouslySetInnerHTML={{ __html: word }}
                />
              ))}
            </div>
          ))}
        </h2>
        <h2
          className={cn(
            "flex flex-col gap-1 text-[clamp(1rem,12vw,7.5rem)] uppercase leading-[.8] text-white sm:hidden",
            containerClassName,
          )}
          style={{
            transform:
              "perspective(1000px)  translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
            transformOrigin: "50% 50% -150px",
            willChange: "transform",
          }}
        >
          {titleSml.split("<br />").map((line, index) => (
            <div key={index} className="flex-center max-w-full flex-wrap px-4">
              {line.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="special-font mr-2 font-zentry font-black"
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
