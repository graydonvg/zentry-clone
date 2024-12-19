"use client";

import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Button } from "./button";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import {
  getCurrentVideoClipPath,
  getHitAreaWidth,
  getNextVideoClipPath,
} from "@/lib/utils";

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

const totalVideos = heroVideos.length;
const minHitAreaWidth = 100;
const maxHitAreaWidth = 250;

export default function Hero() {
  const [currentVideoNumber, setCurrentVideoNumber] = useState(1);
  const [hasClickedHitArea, setHasClickedHitArea] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);
  const windowDimensions = useWindowDimensions();
  const [hitAreaWidth, setHitAreaWidth] = useState<string | number>("20%");
  const [hiddenVideoClipPath, setHiddenVideoClipPath] = useState("");
  const [nextVideoClipPath, setNextVideoClipPath] = useState("");
  const [currentVideoClipPath, setCurrentVideoClipPath] = useState("");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentVideoNumberMinusTwo =
    ((currentVideoNumber - 2 + totalVideos - 1) % totalVideos) + 1;
  const previousVideoNumber =
    ((currentVideoNumber - 1 + totalVideos - 1) % totalVideos) + 1;
  const nextVideoNumber = (currentVideoNumber % totalVideos) + 1;
  const minMaxHitAreaWidth = getHitAreaWidth(
    minHitAreaWidth,
    maxHitAreaWidth,
    windowDimensions,
  );
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [isMouseOverHitArea, setIsMouseOverHitArea] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleMouseMove() {
      setIsMouseMoving(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 300);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setNextVideoClipPath(
      getNextVideoClipPath(minMaxHitAreaWidth, windowDimensions),
    );
    setCurrentVideoClipPath(getCurrentVideoClipPath(windowDimensions));
    setHiddenVideoClipPath(getNextVideoClipPath(0, windowDimensions));
    setHitAreaWidth(minMaxHitAreaWidth);
  }, [windowDimensions]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolledToTop(window.scrollY === 0);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleHitAreaClicked() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setHasClickedHitArea(true);
    setCurrentVideoNumber((prevIndex) => (prevIndex % totalVideos) + 1);
  }

  useGSAP(
    () => {
      if (hasClickedHitArea) {
        // Keep past videos hidden
        gsap.set(`#video-item-${currentVideoNumberMinusTwo}`, {
          display: "none",
          zIndex: 0,
        });

        // Keep the previous video visible during transition
        gsap.set(`#video-item-${previousVideoNumber}`, {
          display: "block",
          zIndex: 0,
        });
        gsap.set(`#video-item-${previousVideoNumber}-content`, {
          clipPath: `path("${currentVideoClipPath}")`,
        });

        // Set the new current video behind the next video option before it grows
        gsap.set(`#video-item-${currentVideoNumber}`, {
          display: "block",
          zIndex: 1,
        });
        gsap.set(`#video-item-${currentVideoNumber}-content`, {
          clipPath: `path("${nextVideoClipPath}")`,
        });
        gsap.set(`#video-item-${currentVideoNumber}-content-border`, {
          attr: {
            d: nextVideoClipPath,
          },
        });

        // Set the next video option in front of the new current video
        gsap.set(`#video-item-${nextVideoNumber}`, {
          display: "block",
          zIndex: 2,
        });
        gsap.set(`#video-item-${nextVideoNumber}-content`, {
          clipPath: `path("${hiddenVideoClipPath}")`,
        });

        // Animate the new current video border to expand to the size of the screen
        gsap.to(`#video-item-${currentVideoNumber}-content-border`, {
          attr: {
            d: currentVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
          onComplete: () => {
            // Remove the border once the video grows to full size
            gsap.set(`#video-item-${currentVideoNumber}-content-border`, {
              attr: {
                d: "",
              },
            });
          },
        });

        // Animate the new current video to expand to the size of the screen
        gsap.to(`#video-item-${currentVideoNumber}-content`, {
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
            gsap.set(`#video-item-${previousVideoNumber}`, {
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
        gsap.to(`#video-item-${nextVideoNumber}-content`, {
          clipPath: `path("${nextVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
        });
        gsap.to(`#video-item-${nextVideoNumber}-content-border`, {
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

  useGSAP(() => {
    gsap.set("#hero-slides", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
    });

    gsap.from("#hero-slides", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-slides",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  useGSAP(
    () => {
      if (isTransitioning) return;

      if (isMouseMoving && isScrolledToTop) {
        gsap.to(`#video-item-${nextVideoNumber}-content`, {
          clipPath: `path("${nextVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
        });
        gsap.to(`#video-item-${nextVideoNumber}-content-border`, {
          attr: {
            d: nextVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
        });
      } else {
        if (isMouseOverHitArea && isScrolledToTop) return;
        gsap.to(`#video-item-${nextVideoNumber}-content`, {
          clipPath: `path("${hiddenVideoClipPath}")`,
          duration: 1,
          ease: "power1.inOut",
        });
        gsap.to(`#video-item-${nextVideoNumber}-content-border`, {
          attr: {
            d: hiddenVideoClipPath,
          },
          duration: 1,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [isMouseMoving, isScrolledToTop],
    },
  );

  return (
    <section
      ref={heroSectionRef}
      className="relative h-dvh w-screen overflow-x-hidden"
    >
      <div id="hero-slides" className="absolute left-0 top-0 z-[1] size-full">
        {/* <svg
          className="absolute left-0 top-0 z-[3] size-full fill-none"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
        >
          <path
            id="hero-slides-border-path"
            className="absolute left-0 top-0 z-[1] size-full fill-none"
            d={heroItemClipPath}
          ></path>
        </svg> */}
        <div
          id="hero-hit-area"
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
              id={`video-item-${videoNumber}`}
              className="absolute left-0 top-0 size-full"
              style={{
                zIndex: video.initialZIndex,
                display: video.initialDisplay,
              }}
            >
              <div
                id={`video-item-${videoNumber}-content`}
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
                    id={`video-item-${videoNumber}-content-border`}
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
              Enter the Metaagame Layer <br /> Unleash the Play Economy
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
