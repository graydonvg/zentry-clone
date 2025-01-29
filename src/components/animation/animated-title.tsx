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
      gsap.set(".animated-word", { autoAlpha: 0 });
      gsap.set("h2", { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: titleContainerRef.current,
          start: scrollTriggerOffset
            ? `70%+=${scrollTriggerOffset} bottom`
            : "70% bottom",
          end: scrollTriggerOffset
            ? `bottom+=${scrollTriggerOffset} bottom`
            : "bottom bottom",
          onEnter: () => {
            tl.clear();

            tl.fromTo(
              "p .animated-word",
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
              "p .animated-word",
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
    {
      scope: titleContainerRef,
      dependencies: [scrollTriggerOffset],
      revertOnUpdate: true,
    },
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
        <p className="text-caption/none font-general font-medium uppercase">
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
        className="text-h2-lg/[0.8] hidden flex-col gap-1 uppercase sm:flex sm:px-32"
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
          className="text-h2-sm/[0.8] flex flex-col gap-1 uppercase sm:hidden"
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
