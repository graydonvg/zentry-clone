"use client";

import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Button } from "./button";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const totalVideos = 4;

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1);
  const [hasClickedHitArea, setHasClickedHitArea] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const videoRef4 = useRef<HTMLVideoElement>(null);

  function handleHitAreaClicked() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setHasClickedHitArea(true);
    setCurrentVideoIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  }

  const videoIndexMinusTwo =
    ((currentVideoIndex - 2 + totalVideos - 1) % totalVideos) + 1;

  const videoIndexMinusOne =
    ((currentVideoIndex - 1 + totalVideos - 1) % totalVideos) + 1;

  const videoIndexPlusOne = (currentVideoIndex % totalVideos) + 1;

  useGSAP(
    () => {
      if (hasClickedHitArea) {
        gsap.set(`#hero-item-${videoIndexMinusTwo}`, {
          display: "none",
          zIndex: 0,
        });

        gsap.set(`#hero-item-${videoIndexMinusOne}`, {
          display: "block",
          zIndex: 0,
        });
        gsap.set(`#hero-item-${videoIndexMinusOne}-content`, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        });

        gsap.set(`#hero-item-${currentVideoIndex}`, {
          display: "block",
          zIndex: 1,
        });
        gsap.set(`#hero-item-${currentVideoIndex}-content`, {
          clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
        });

        gsap.set(`#hero-item-${videoIndexPlusOne}`, {
          display: "block",
          zIndex: 2,
        });
        gsap.set(`#hero-item-${videoIndexPlusOne}-content`, {
          clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
        });

        gsap.to(`#hero-item-${currentVideoIndex}-content`, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            const video = {
              1: videoRef1,
              2: videoRef2,
              3: videoRef3,
              4: videoRef4,
            };

            const currentVideo =
              video[currentVideoIndex as keyof typeof video].current;

            if (currentVideo) {
              currentVideo.play();
            }
          },
          onComplete: () => {
            gsap.set(`#hero-item-${videoIndexMinusOne}`, {
              display: "none",
            });
            gsap.set(`#hero-item-${videoIndexMinusOne}-content`, {
              clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
            });
            const video = {
              1: videoRef1,
              2: videoRef2,
              3: videoRef3,
              4: videoRef4,
            };

            const previousVideo =
              video[videoIndexMinusOne as keyof typeof video].current;

            if (previousVideo) {
              previousVideo.pause();
              previousVideo.currentTime = 0;
            }
            setIsTransitioning(false);
            setHasClickedHitArea(false);
          },
        });

        gsap.from(`#hero-item-${videoIndexPlusOne}-content`, {
          scale: 0,
          duration: 1,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentVideoIndex],
      revertOnUpdate: true,
    },
  );

  useGSAP(() => {
    gsap.set("#hero-slides", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#hero-slides", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-slides",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const [isMouseOverHitArea, setIsMouseOverHitArea] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const movementTimeout = 200; // Time (ms) to detect if the mouse stopped moving
  let timeoutId: ReturnType<typeof setTimeout>;

  function handleMouseMove() {
    // Clear the existing timeout to reset the stop detection
    clearTimeout(timeoutId);

    // Indicate the mouse is moving
    setIsMouseMoving(true);

    // Set a timeout to detect when the mouse stops moving
    timeoutId = setTimeout(() => {
      setIsMouseMoving(false);
    }, movementTimeout);
  }

  useEffect(() => {
    if (!heroSectionRef.current) return;

    heroSectionRef.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (!heroSectionRef.current) return;
      heroSectionRef.current.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useGSAP(
    () => {
      if (isMouseMoving) {
        gsap.to(`#hero-item-${videoIndexPlusOne}-content`, {
          clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
          duration: 0.5,
          ease: "power1.inOut",
        });
      } else {
        if (isMouseOverHitArea) return;
        gsap.to(`#hero-item-${videoIndexPlusOne}-content`, {
          clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
          duration: 0.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [isMouseMoving],
    },
  );

  return (
    <section
      ref={heroSectionRef}
      className="relative h-dvh w-screen overflow-x-hidden"
    >
      <div id="hero-slides" className="absolute left-0 top-0 z-[1] size-full">
        <div
          id="hero-hit-area"
          onMouseEnter={() => setIsMouseOverHitArea(true)}
          onMouseLeave={() => setIsMouseOverHitArea(false)}
          onClick={handleHitAreaClicked}
          className="absolute left-1/2 top-1/2 z-[100] aspect-square w-1/5 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        ></div>

        <div
          id="hero-item-1"
          className="absolute left-0 top-0 size-full"
          style={{ zIndex: 1 }}
        >
          <div
            id="hero-item-1-content"
            className="absolute left-0 top-0 z-[1] size-full bg-violet-300"
          >
            <div
              id="hero-item-1-inner"
              className="visible absolute left-0 top-0 size-full opacity-100"
            >
              <video
                ref={videoRef1}
                src="videos/hero-1.mp4"
                // autoPlay
                muted
                playsInline
                loop
                preload="metadata"
                className="absolute left-0 top-0 size-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          id="hero-item-2"
          className="absolute left-0 top-0 size-full"
          style={{ zIndex: 2 }}
        >
          <div
            id="hero-item-2-content"
            className="absolute left-0 top-0 z-[1] size-full bg-violet-300"
            style={{
              clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
            }}
          >
            <div
              id="hero-item-2-inner"
              className="visible absolute left-0 top-0 size-full opacity-100"
            >
              <video
                ref={videoRef2}
                src="videos/hero-2.mp4"
                muted
                playsInline
                loop
                preload="metadata"
                className="absolute left-0 top-0 size-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          id="hero-item-3"
          className="absolute left-0 top-0 size-full"
          style={{ zIndex: 0, display: "none" }}
        >
          <div
            id="hero-item-3-content"
            className="absolute left-0 top-0 z-[1] size-full bg-violet-300"
            style={{
              clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
            }}
          >
            <div
              id="hero-item-3-inner"
              className="visible absolute left-0 top-0 size-full opacity-100"
            >
              <video
                ref={videoRef3}
                src="videos/hero-3.mp4"
                muted
                playsInline
                loop
                preload="metadata"
                className="absolute left-0 top-0 size-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          id="hero-item-4"
          className="absolute left-0 top-0 size-full"
          style={{ zIndex: 0, display: "none" }}
        >
          <div
            id="hero-item-4-content"
            className="absolute left-0 top-0 z-[1] size-full bg-violet-300"
            style={{
              clipPath: "polygon(40% 36.5%, 60% 36.5%, 60% 63.5%, 40% 63.5%)",
            }}
          >
            <div
              id="hero-item-4-inner"
              className="visible absolute left-0 top-0 size-full opacity-100"
            >
              <video
                ref={videoRef4}
                src="videos/hero-4.mp4"
                muted
                playsInline
                loop
                preload="metadata"
                className="absolute left-0 top-0 size-full object-cover"
              />
            </div>
          </div>
        </div>
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
