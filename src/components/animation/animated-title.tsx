import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  titleLrg: string;
  titleSml: string;
  caption?: string;
  containerClassName?: string;
};

export default function AnimatedTitle({
  titleLrg,
  titleSml,
  containerClassName,
  caption,
}: Props) {
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: titleContainerRef.current,
            start: "70% bottom",
            toggleActions: "play none none reverse",
          },
        })
        .to(".caption .animated-word", {
          opacity: 1,
          duration: 0.01,
          stagger: {
            amount: 0.2,
          },
        })

        .to(
          "h2",
          {
            opacity: 1,
            duration: 0.01,
          },
          ">",
        )
        .to(
          "h2",
          {
            transform:
              "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
            ease: "power2.out",
            duration: 1,
          },
          "<",
        )
        .to(
          "h2 .animated-word",
          {
            opacity: 1,
            duration: 0.01,
            stagger: {
              amount: 0.3,
            },
          },
          "<",
        );
    },
    { scope: titleContainerRef },
  );

  return (
    <div
      ref={titleContainerRef}
      className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8"
    >
      {caption && (
        <p className="caption font-general text-[clamp(0.75rem,0.7262rem+0.119vw,0.875rem)] font-medium uppercase leading-none">
          {caption.split(" ").map((word, index) => (
            <Fragment key={index}>
              <span
                className="animated-word inline-flex opacity-0"
                style={{ willChange: "opacity" }}
                dangerouslySetInnerHTML={{ __html: word }}
              />{" "}
            </Fragment>
          ))}
        </p>
      )}

      <h2
        className={cn(
          "hidden flex-col gap-1 text-[clamp(3.125rem,1.0662rem+5.1471vw,7.5rem)] uppercase leading-[.8] text-white opacity-0 sm:flex sm:px-32",
          containerClassName,
        )}
        style={{
          transform:
            "perspective(1000px) translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
          transformOrigin: "50% 50% -150px",
          willChange: "transform, opacity",
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
          "flex flex-col gap-1 text-[clamp(2.5rem,0rem+12.5vw,5rem)] uppercase leading-[.8] text-white opacity-0 sm:hidden",
          containerClassName,
        )}
        style={{
          transform:
            "perspective(1000px)  translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
          transformOrigin: "50% 50% -150px",
          willChange: "transform, opacity",
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
}
