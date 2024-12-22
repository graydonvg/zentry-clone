"use client";

import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Button } from "./button";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import {
  getFullScreenClipPath,
  getHiddenHeroVideoNumbers,
  getHitAreaWidth,
  getNextVideoClipPath,
  getFirstTransformedHeroClipPath,
  getSecondTransformedHeroClipPath,
} from "@/lib/utils";
import useMouseMoving from "@/hooks/use-mouse-moving";
import useScrolledToTop from "@/hooks/use-scrolled-to-top";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const heroVideos = [
  {
    initialZIndex: 1,
    autoPlay: false,
  },
  {
    initialZIndex: 2,
  },
  {
    initialZIndex: 0,
    initialDisplay: "none",
  },
  {
    initialZIndex: 0,
    initialDisplay: "none",
  },
];

const MIN_HIT_AREA_WIDTH = 100;
const MAX_HIT_AREA_WIDTH = 250;

export default function Hero() {
  const isMouseMoving = useMouseMoving();
  const isScrolledToTop = useScrolledToTop();
  const windowDimensions = useWindowDimensions();
  const [currentVideoNumber, setCurrentVideoNumber] = useState(1);
  const [hasClickedHitArea, setHasClickedHitArea] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hitAreaWidth, setHitAreaWidth] = useState<string | number>("20%");
  const [hiddenVideoClipPath, setHiddenVideoClipPath] = useState("");
  const [nextVideoClipPath, setNextVideoClipPath] = useState("");
  const [currentVideoClipPath, setCurrentVideoClipPath] = useState("");
  const [firstTransformedHeroClipPath, setFirstTransformedHeroClipPath] =
    useState("");
  const [secondTransformedHeroClipPath, setSecondTransformedHeroClipPath] =
    useState("");
  const [isMouseOverHitArea, setIsMouseOverHitArea] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBorderRef = useRef<SVGPathElement>(null);
  const videoItemContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoItemContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoItemBorderRefs = useRef<(SVGPathElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const totalVideos = heroVideos.length;
  const previousVideoNumber =
    ((currentVideoNumber - 1 + totalVideos - 1) % totalVideos) + 1;
  const nextVideoNumber = (currentVideoNumber % totalVideos) + 1;
  const minMaxHitAreaWidth = getHitAreaWidth(
    MIN_HIT_AREA_WIDTH,
    MAX_HIT_AREA_WIDTH,
    windowDimensions,
  );

  useEffect(() => {
    setNextVideoClipPath(
      getNextVideoClipPath(minMaxHitAreaWidth, windowDimensions),
    );
    setCurrentVideoClipPath(getFullScreenClipPath(windowDimensions));
    setHiddenVideoClipPath(getNextVideoClipPath(0, windowDimensions));
    setHitAreaWidth(minMaxHitAreaWidth);
    setFirstTransformedHeroClipPath(
      getFirstTransformedHeroClipPath(windowDimensions),
    );
    setSecondTransformedHeroClipPath(
      getSecondTransformedHeroClipPath(windowDimensions),
    );
  }, [windowDimensions]);

  function handleHitAreaClicked() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setHasClickedHitArea(true);
    setCurrentVideoNumber((prevIndex) => (prevIndex % totalVideos) + 1);
  }

  useGSAP(
    () => {
      if (isTransitioning) return;

      if (isMouseMoving && isScrolledToTop && !isMouseOverHitArea) {
        gsap.to(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${nextVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
        });
        gsap.to(videoItemBorderRefs.current[nextVideoNumber], {
          attr: {
            d: nextVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
        });
      } else {
        if (isMouseOverHitArea && isScrolledToTop) return;
        gsap.to(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${hiddenVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
        });
        gsap.to(videoItemBorderRefs.current[nextVideoNumber], {
          attr: {
            d: hiddenVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [isMouseMoving, isScrolledToTop, isTransitioning],
    },
  );

  useGSAP(
    () => {
      if (hasClickedHitArea) {
        // Keep past videos hidden
        const hiddenVideoNumbers = getHiddenHeroVideoNumbers(
          currentVideoNumber,
          totalVideos,
        );

        hiddenVideoNumbers.forEach((hiddenVideoNumber) =>
          gsap.set(videoItemContainerRefs.current[hiddenVideoNumber], {
            display: "none",
            zIndex: 0,
          }),
        );

        // Keep the previous video visible during transition
        gsap.set(videoItemContainerRefs.current[previousVideoNumber], {
          display: "block",
          zIndex: 0,
        });
        gsap.set(videoItemContentRefs.current[previousVideoNumber], {
          clipPath: `path("${currentVideoClipPath}")`,
        });

        // Set the new current video behind the next video option before it grows
        gsap.set(videoItemContainerRefs.current[currentVideoNumber], {
          display: "block",
          zIndex: 1,
        });
        gsap.set(videoItemContentRefs.current[currentVideoNumber], {
          clipPath: `path("${nextVideoClipPath}")`,
        });
        gsap.set(videoItemBorderRefs.current[currentVideoNumber], {
          attr: {
            d: nextVideoClipPath,
          },
        });

        // Set the next video option in front of the new current video
        gsap.set(videoItemContainerRefs.current[nextVideoNumber], {
          display: "block",
          zIndex: 2,
        });
        gsap.set(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${hiddenVideoClipPath}")`,
        });

        // Animate the new current video border to expand to the size of the screen
        gsap.to(videoItemBorderRefs.current[currentVideoNumber], {
          attr: {
            d: currentVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
          onComplete: () => {
            // Remove the border once the video grows to full size
            gsap.set(videoItemBorderRefs.current[currentVideoNumber], {
              attr: {
                d: "",
              },
            });
          },
        });

        // Animate the new current video to expand to the size of the screen
        gsap.to(videoItemContentRefs.current[currentVideoNumber], {
          clipPath: `path("${currentVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            const currentVideo = videoRefs.current[currentVideoNumber];

            if (currentVideo) {
              currentVideo.play();
            }
          },
          onComplete: () => {
            // Hide the previous video once the new current video grows to full size
            gsap.set(videoItemContainerRefs.current[previousVideoNumber], {
              display: "none",
            });

            const previousVideo = videoRefs.current[previousVideoNumber];

            if (previousVideo) {
              previousVideo.pause();
              previousVideo.currentTime = 0;
            }
            setIsTransitioning(false);
            setHasClickedHitArea(false);
          },
        });

        // Reveal the next video option
        gsap.to(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${nextVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
        });
        gsap.to(videoItemBorderRefs.current[nextVideoNumber], {
          attr: {
            d: nextVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentVideoNumber],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "center center",
            end: "bottom top",
            scrub: 0.5,
          },
        })
        .fromTo(
          heroRef.current,
          {
            clipPath: `path("${currentVideoClipPath}")`,
          },
          {
            clipPath: `path("${firstTransformedHeroClipPath}")`,
            ease: "power1.inOut",
          },
        )
        .fromTo(
          heroBorderRef.current,
          {
            attr: {
              d: isScrolledToTop ? "" : currentVideoClipPath,
            },
          },
          {
            attr: {
              d: firstTransformedHeroClipPath,
            },
            ease: "power1.inOut",
          },
          // Start at the beginning of the timeline
          0,
        )
        .to(
          heroRef.current,
          {
            clipPath: `path("${secondTransformedHeroClipPath}")`,
            ease: "power1.inOut",
          },
          // Insert at the END of the previous animation
          ">",
        )
        .to(
          heroBorderRef.current,
          {
            attr: {
              d: secondTransformedHeroClipPath,
            },
            ease: "power1.inOut",
          },
          // Insert at the START of the  previous animation
          "<",
        );
    },
    {
      dependencies: [
        isScrolledToTop,
        currentVideoClipPath,
        firstTransformedHeroClipPath,
        secondTransformedHeroClipPath,
      ],
      revertOnUpdate: true,
    },
  );

  return (
    <section className="relative h-dvh w-screen overflow-x-hidden">
      <div
        ref={heroRef}
        id="hero-slides"
        className="absolute left-0 top-0 z-[1] size-full"
      >
        <svg
          className="absolute left-0 top-0 z-[3] size-full fill-none"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
        >
          <path
            ref={heroBorderRef}
            className="absolute left-0 top-0 z-[1] size-full fill-none"
            d=""
          ></path>
        </svg>
        <div
          onMouseEnter={() => setIsMouseOverHitArea(true)}
          onMouseLeave={() => setIsMouseOverHitArea(false)}
          onClick={handleHitAreaClicked}
          className="absolute left-1/2 top-1/2 z-[100] aspect-square -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg"
          style={{ width: hitAreaWidth }}
        ></div>

        {heroVideos.map((video, index) => {
          const videoNumber = index + 1;
          const clipPath =
            videoNumber === currentVideoNumber
              ? currentVideoClipPath
              : hiddenVideoClipPath;
          const borderPath =
            videoNumber == nextVideoNumber ? hiddenVideoClipPath : undefined;

          return (
            <div
              key={videoNumber}
              ref={(el) => {
                videoItemContainerRefs.current[videoNumber] = el;
              }}
              className="absolute left-0 top-0 size-full"
              style={{
                zIndex: video.initialZIndex,
                display: video.initialDisplay,
              }}
            >
              <div
                ref={(el) => {
                  videoItemContentRefs.current[videoNumber] = el;
                }}
                className="absolute left-0 top-0 z-[1] size-full bg-violet-300"
                style={{
                  clipPath: `path("${clipPath}")`,
                }}
              >
                <svg
                  className="absolute left-0 top-0 z-[3] size-full fill-none"
                  stroke={"#000000"}
                  strokeWidth="2"
                  fill="none"
                >
                  <path
                    ref={(el) => {
                      videoItemBorderRefs.current[videoNumber] = el;
                    }}
                    className="absolute left-0 top-0 z-[3] size-full fill-none"
                    d={borderPath}
                  ></path>
                </svg>
                <div className="visible absolute left-0 top-0 size-full">
                  <video
                    ref={(el) => {
                      videoRefs.current[videoNumber] = el;
                    }}
                    src={`videos/hero-${videoNumber}.mp4`}
                    autoPlay={video.autoPlay}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className="absolute left-0 top-0 size-full object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-75">
              redefi<b>n</b>e
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              leftIcon={<TiLocationArrow className="size-4 rotate-45" />}
              className="bg-yellow-300"
            >
              Watch Trailer
            </Button>
          </div>
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          g<b>a</b>ming
        </h1>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        g<b>a</b>ming
      </h1>
    </section>
  );
}
