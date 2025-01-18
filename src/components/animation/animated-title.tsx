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
  scrollTriggerOffset?: number;
};

export default function AnimatedTitle({
  titleLrg,
  titleSml,
  containerClassName,
  caption,
  scrollTriggerOffset,
}: Props) {
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".caption .animated-word", { autoAlpha: 0 });
      gsap.set("h2", { autoAlpha: 0 });
      gsap.set("h2 .animated-word", { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleContainerRef.current,
          start: scrollTriggerOffset
            ? `70%+=${scrollTriggerOffset} bottom`
            : "70% bottom",
          onEnter: () => {
            tl.clear();

            tl.fromTo(
              ".caption .animated-word",
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                duration: 0.01,
                stagger: {
                  amount: 0.2,
                },
              },
            )

              .fromTo(
                "h2",
                { autoAlpha: 0 },
                {
                  autoAlpha: 1,
                  duration: 0.01,
                },
                ">",
              )
              .fromTo(
                "h2",
                {
                  transform:
                    "perspective(1000px) translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
                },
                {
                  transform:
                    "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
                  ease: "power2.out",
                  duration: 1,
                },
                "<",
              )
              .fromTo(
                "h2 .animated-word",
                { autoAlpha: 0 },
                {
                  autoAlpha: 1,
                  duration: 0.01,
                  stagger: {
                    amount: 0.3,
                  },
                },
                "<",
              );
          },

          onLeaveBack: () => {
            tl.fromTo(
              ".caption .animated-word",
              { autoAlpha: 1 },
              {
                autoAlpha: 0,
                duration: 0.01,
                stagger: {
                  amount: 0.2,
                },
              },
            )

              .fromTo(
                "h2",
                {
                  transform:
                    "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
                },
                {
                  transform:
                    "perspective(1000px) translate3d(110px, 50px, -60px) rotateY(50deg) rotateX(-20deg)",
                  ease: "power2.out",
                  duration: 1,
                },
                ">",
              )
              .fromTo(
                "h2 .animated-word",
                { autoAlpha: 1 },
                {
                  autoAlpha: 0,
                  duration: 0.01,
                  stagger: {
                    amount: 0.2,
                    from: "end",
                  },
                },
                "<",
              )
              .fromTo(
                "h2",
                { opacity: 1 },
                {
                  opacity: 0,
                  duration: 0.01,
                },
                ">",
              );
          },
        },
      });
    },
    { scope: titleContainerRef },
  );

  return (
    <div
      ref={titleContainerRef}
      className={cn(
        "flex flex-col items-center justify-center gap-4 space-y-5 sm:gap-6 md:gap-8",
        containerClassName,
      )}
    >
      {caption && (
        <p className="caption font-general text-[clamp(0.625rem,0.5074rem+0.2941vw,0.875rem)] font-medium uppercase leading-none">
          {caption.split(" ").map((word, index) => (
            <Fragment key={index}>
              <span
                className="animated-word inline-flex"
                style={{ willChange: "opacity" }}
                dangerouslySetInnerHTML={{ __html: word }}
              />{" "}
            </Fragment>
          ))}
        </p>
      )}

      <h2
        className="hidden flex-col gap-1 text-[clamp(3.125rem,1.0662rem+5.1471vw,7.5rem)] uppercase leading-[.8] sm:flex sm:px-32"
        style={{
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
                className="animated-word special-font font-zentry font-black"
                style={{ willChange: "opacity" }}
                dangerouslySetInnerHTML={{ __html: word }}
              />
            ))}
          </div>
        ))}
      </h2>
      {titleSml && (
        <h2
          className={cn(
            "flex flex-col gap-1 text-[clamp(2.5rem,0rem+12.5vw,5rem)] uppercase leading-[.8] text-white sm:hidden",
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
      )}
    </div>
  );
}
