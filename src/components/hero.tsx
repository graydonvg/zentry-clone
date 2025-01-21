"use client";

import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Button } from "./ui/button";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import {
  getFullScreenClipPath,
  getHiddenHeroVideoNumbers,
  getHitAreaSideLength,
  getNextVideoClipPath,
  getFirstTransformedHeroClipPath,
  getSecondTransformedHeroClipPath,
} from "@/lib/utils";
import useMouseMoving from "@/hooks/use-mouse-moving";
import useScrolledToTop from "@/hooks/use-scrolled-to-top";
import { ListBlobResultBlob } from "@vercel/blob";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function splitAndMapTextWithTags(str: string, className: string) {
  const regex = /<[^>]+>[^<]*<\/[^>]+>|[^<]/g; // Matches entire tags with content or single characters

  return str.match(regex)?.map((part, index) => {
    if (part.startsWith("<")) {
      // If the part is an HTML tag with content, return tag with content wrapped in a span
      return (
        <span
          key={index}
          className={className}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    }
    // For regular characters, wrap them in spans
    return (
      <span
        key={index}
        className={className}
        dangerouslySetInnerHTML={{ __html: part }}
      />
    );
  });
}

function getHeroVideos(heroVideosBlob: ListBlobResultBlob[]) {
  const videoMap = new Map(
    heroVideosBlob.map((video) => [
      video.pathname.split("/").at(-1),
      video.url,
    ]),
  );

  const heroVideos = [
    {
      initialZIndex: 10,
      autoPlay: false,
      src: videoMap.get("hero-1.mp4"),
    },
    {
      initialZIndex: 20,
      src: videoMap.get("hero-2.mp4"),
    },
    {
      initialZIndex: -10,
      initialDisplay: "none",
      src: videoMap.get("hero-3.mp4"),
    },
    {
      initialZIndex: -10,
      initialDisplay: "none",
      src: videoMap.get("hero-4.mp4"),
    },
  ];

  return heroVideos;
}

const MIN_HIT_AREA_SIDE_LENGTH = 100;
const MAX_HIT_AREA_SIDE_LENGTH = 250;

const animatedTitles = [
  "g<b>a</b>ming",
  "ide<b>n</b>tity",
  "re<b>a</b>lity",
  "lif<b>e</b>style",
];

type Props = {
  heroVideosBlob: ListBlobResultBlob[];
};

export default function Hero({ heroVideosBlob }: Props) {
  const isMouseMoving = useMouseMoving();
  const isScrolledToTop = useScrolledToTop();
  const windowDimensions = useWindowDimensions();
  const [currentVideoNumber, setCurrentVideoNumber] = useState(0);
  const [hasClickedHitArea, setHasClickedHitArea] = useState(false);
  const [hitAreaSideLength, setHitAreaSideLength] = useState<string | number>(
    "20%",
  );
  const [hiddenVideoClipPath, setHiddenVideoClipPath] = useState("");
  const [nextVideoClipPath, setNextVideoClipPath] = useState("");
  const [currentVideoClipPath, setCurrentVideoClipPath] = useState("");
  const [firstTransformedHeroClipPath, setFirstTransformedHeroClipPath] =
    useState("");
  const [secondTransformedHeroClipPath, setSecondTransformedHeroClipPath] =
    useState("");
  const animatedTitleIndexRef = useRef({
    exit: 0,
    enter: 1,
  });
  const isTransitioningRef = useRef(false);
  const isMouseOverHitAreaRef = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const hitAreaRef = useRef<HTMLDivElement>(null);
  const fakeHitAreaRef = useRef<HTMLDivElement>(null);
  const heroBorderRef = useRef<SVGPathElement>(null);
  const videoItemContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoItemContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoItemBorderRefs = useRef<(SVGPathElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const heroVideos = getHeroVideos(heroVideosBlob);
  const totalVideos = heroVideos.length;
  const previousVideoNumber =
    (currentVideoNumber - 1 + totalVideos) % totalVideos;
  const nextVideoNumber = (currentVideoNumber + 1) % totalVideos;
  const minMaxHitAreaSideLength = getHitAreaSideLength(
    MIN_HIT_AREA_SIDE_LENGTH,
    MAX_HIT_AREA_SIDE_LENGTH,
    windowDimensions,
  );
  const isTouchDevice = navigator.maxTouchPoints > 0;

  useEffect(() => {
    setNextVideoClipPath(
      getNextVideoClipPath(minMaxHitAreaSideLength, windowDimensions),
    );
    setCurrentVideoClipPath(getFullScreenClipPath(windowDimensions));
    setHiddenVideoClipPath(getNextVideoClipPath(0, windowDimensions));
    setHitAreaSideLength(minMaxHitAreaSideLength);
    setFirstTransformedHeroClipPath(
      getFirstTransformedHeroClipPath(windowDimensions),
    );
    setSecondTransformedHeroClipPath(
      getSecondTransformedHeroClipPath(windowDimensions),
    );
  }, [windowDimensions, minMaxHitAreaSideLength]);

  function handleHitAreaClicked() {
    if (isTransitioningRef.current || !isScrolledToTop) return;

    isTransitioningRef.current = true;
    setHasClickedHitArea(true);
    animatedTitleIndexRef.current = {
      exit: currentVideoNumber,
      enter: nextVideoNumber,
    };
    setCurrentVideoNumber((prevIndex) => (prevIndex + 1) % totalVideos);
  }

  // Hidden video initial position
  useGSAP(
    () => {
      if (!isTouchDevice) {
        gsap.set(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${hiddenVideoClipPath}")`,
        });
        gsap.set(videoItemBorderRefs.current[nextVideoNumber], {
          attr: {
            d: hiddenVideoClipPath,
          },
        });
      } else {
        gsap.set(hitAreaRef.current, {
          scale: 1,
        });
        gsap.set(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${nextVideoClipPath}")`,
        });
        gsap.set(videoItemBorderRefs.current[nextVideoNumber], {
          attr: {
            d: nextVideoClipPath,
          },
        });
      }
    },
    { dependencies: [nextVideoClipPath] },
  );

  // Parallax tilt and translate on mouse move
  useGSAP(
    (_context, contextSafe) => {
      const controller = new AbortController();
      const nextVideoClipPath = videoItemContentRefs.current[nextVideoNumber];
      const nextVideo = videoRefs.current[nextVideoNumber];
      const hitArea = hitAreaRef.current;
      const fakeHitArea = fakeHitAreaRef.current;

      if (
        !nextVideoClipPath ||
        !nextVideo ||
        !hitArea ||
        !fakeHitArea ||
        isTouchDevice ||
        !contextSafe
      )
        return;

      function getElementReact(element: HTMLElement) {
        return element.getBoundingClientRect();
      }

      const handleMouseMove = contextSafe((e: MouseEvent) => {
        const fakeHitAreaRect = getElementReact(fakeHitArea);

        const centerX = fakeHitAreaRect.left + fakeHitAreaRect.width / 2;
        const centerY = fakeHitAreaRect.top + fakeHitAreaRect.height / 2;

        const translateIntensity = 0.2;

        const translateX = (e.clientX - centerX) * translateIntensity;
        const translateY = (e.clientY - centerY) * translateIntensity;

        const relativeX =
          (e.clientX - fakeHitAreaRect.left) / fakeHitAreaRect.width;
        const relativeY =
          (e.clientY - fakeHitAreaRect.top) / fakeHitAreaRect.height;

        const tiltIntensity = 3;

        let rotateX = (relativeY - 0.5) * -tiltIntensity;
        let rotateY = (relativeX - 0.5) * tiltIntensity;

        // Clamp the values between -7 and 7
        rotateX = Math.max(-7, Math.min(7, rotateX));
        rotateY = Math.max(-7, Math.min(7, rotateY));

        const hitAreaTranslateIntensity = 0.8;

        gsap.to(hitArea, {
          // Reduce hit area translation to prevent to prevent it from travelling outside of the next video clip path
          translateX: translateX * hitAreaTranslateIntensity,
          translateY: translateY * hitAreaTranslateIntensity,
        });

        gsap.to(nextVideoClipPath, {
          translateX,
          translateY,
          rotateX,
          rotateY,
        });

        gsap.to(nextVideo, {
          translateX: -translateX,
          translateY: -translateY,
          rotateX: -rotateX,
          rotateY: -rotateY,
        });
      });

      window.addEventListener("mousemove", handleMouseMove, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
      };
    },
    {
      dependencies: [nextVideoNumber],
      revertOnUpdate: true,
    },
  );

  // Grow/shrink on mouse move
  useGSAP(
    () => {
      if (isTransitioningRef.current || isTouchDevice) return;

      if (isMouseMoving && isScrolledToTop && !isMouseOverHitAreaRef.current) {
        gsap.to(hitAreaRef.current, {
          scale: 1,
          duration: 1,
          ease: "power1.inOut",
        });
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
        if (isMouseOverHitAreaRef.current && isScrolledToTop) return;
        gsap.to(hitAreaRef.current, {
          scale: 0,
          duration: 1,
          ease: "power1.inOut",
        });
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
      dependencies: [
        isMouseMoving,
        isScrolledToTop,
        isTransitioningRef.current,
        hiddenVideoClipPath,
      ],
    },
  );

  // Cycle vids on click
  useGSAP(
    () => {
      if (hasClickedHitArea) {
        //Ensure the hit area remains at full scale
        gsap.set(hitAreaRef.current, {
          scale: 1,
        });

        // Keep past videos hidden
        const hiddenVideoNumbers = getHiddenHeroVideoNumbers(
          currentVideoNumber,
          totalVideos,
        );

        hiddenVideoNumbers.forEach((hiddenVideoNumber) => {
          gsap.set(videoItemContainerRefs.current[hiddenVideoNumber], {
            display: "none",
            zIndex: -10,
          });
        });

        // Keep the previous video visible during transition
        gsap.set(videoItemContainerRefs.current[previousVideoNumber], {
          display: "block",
          zIndex: -10,
        });
        gsap.set(videoItemContentRefs.current[previousVideoNumber], {
          clipPath: `path("${currentVideoClipPath}")`,
        });

        // Set the new current video behind the next video option before it grows
        gsap.set(videoItemContainerRefs.current[currentVideoNumber], {
          display: "block",
          zIndex: 10,
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
          zIndex: 20,
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
          ease: "power2.out",
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
          ease: "power2.out",
          onStart: () => {
            const currentVideo = videoRefs.current[currentVideoNumber];

            if (currentVideo) {
              // currentVideo.play();
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
            isTransitioningRef.current = false;
            setHasClickedHitArea(false);
          },
        });

        // Reveal the next video option
        gsap.to(videoItemContentRefs.current[nextVideoNumber], {
          clipPath: `path("${nextVideoClipPath}")`,
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(videoItemBorderRefs.current[nextVideoNumber], {
          attr: {
            d: nextVideoClipPath,
          },
          duration: 1,
          ease: "power2.out",
        });
      }
    },
    {
      dependencies: [currentVideoNumber],
      revertOnUpdate: true,
    },
  );

  // Animated title on click
  useGSAP(
    () => {
      if (hasClickedHitArea) {
        gsap
          .timeline()
          .fromTo(
            ".animate-tile-exit",
            {
              transform:
                "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
            },
            {
              transform:
                "perspective(1000px) translate3d(100px, 30px, 20px) rotateY(60deg) rotateX(-20deg)",
            },
          )
          .fromTo(
            ".animate-tile-char-exit",
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.01,
              stagger: {
                amount: 0.4,
              },
            },
            0.2,
          )
          .fromTo(
            ".animate-tile-enter",
            {
              transform:
                "perspective(1000px) translate3d(0px, -150px, 20px) rotateZ(-20deg) rotateX(60deg)",
            },
            {
              transform:
                "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
            },
            0.4,
          )
          .fromTo(
            ".animate-tile-char-enter",
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.01,
              stagger: {
                amount: 0.6,
              },
            },
            0.4,
          );
      }
    },

    { dependencies: [hasClickedHitArea] },
  );

  // Hero clip path on scroll
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
    <section className="relative min-h-screen w-full overflow-hidden">
      <div
        ref={heroRef}
        id="hero-slides"
        className="absolute left-0 top-0 z-10 size-full overflow-hidden"
      >
        <svg
          className="pointer-events-none absolute left-0 top-0 z-30 size-full fill-none"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
        >
          <path
            ref={heroBorderRef}
            className="absolute left-0 top-0 z-10 size-full fill-none"
            d=""
          ></path>
        </svg>
        <div
          ref={fakeHitAreaRef}
          className="pointer-events-none invisible absolute left-1/2 top-1/2 -z-50 aspect-square -translate-x-1/2 -translate-y-1/2 select-none rounded-lg"
          style={{
            width: hitAreaSideLength,
            height: hitAreaSideLength,
          }}
        />

        <div
          ref={hitAreaRef}
          onMouseOver={() => (isMouseOverHitAreaRef.current = true)}
          onMouseLeave={() => (isMouseOverHitAreaRef.current = false)}
          onClick={handleHitAreaClicked}
          className="absolute left-1/2 top-1/2 z-50 aspect-square -translate-x-1/2 -translate-y-1/2 scale-0 cursor-pointer rounded-lg"
          style={{
            width: hitAreaSideLength,
            height: hitAreaSideLength,
            willChange: "transform",
          }}
        />

        {heroVideos.map((video, index) => {
          const clipPath =
            index === currentVideoNumber
              ? currentVideoClipPath
              : hiddenVideoClipPath;
          const borderPath =
            index == nextVideoNumber ? hiddenVideoClipPath : undefined;

          return (
            <div
              key={index}
              ref={(el) => {
                videoItemContainerRefs.current[index] = el;
              }}
              className="absolute left-0 top-0 size-full"
              style={{
                zIndex: video.initialZIndex,
                display: video.initialDisplay,
              }}
            >
              <div
                ref={(el) => {
                  videoItemContentRefs.current[index] = el;
                }}
                className="absolute left-0 top-0 z-10 size-full overflow-hidden bg-violet-300"
                style={{
                  clipPath: `path("${clipPath}")`,
                  transform: "perspective(100px)",
                  willChange: "transform",
                }}
              >
                <svg
                  className="absolute left-0 top-0 z-30 size-full fill-none"
                  stroke={"#000000"}
                  strokeWidth="2"
                  fill="none"
                >
                  <path
                    ref={(el) => {
                      videoItemBorderRefs.current[index] = el;
                    }}
                    className="absolute left-0 top-0 z-30 size-full fill-none"
                    d={borderPath}
                  ></path>
                </svg>
                <div className="visible absolute left-0 top-0 size-full">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={video.src}
                    autoPlay={video.autoPlay}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className="absolute left-0 top-0 size-full object-cover"
                    style={{
                      transform: "perspective(100px)",
                      willChange: "transform",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute left-0 top-0 z-20 size-full px-8">
          <h1 className="hero-heading mt-24 text-blue-75">
            redefi<b>n</b>e
          </h1>
          <p className="mb-5 font-robert-regular text-blue-100">
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

        <h1
          className="hero-heading animate-tile-exit absolute bottom-6 right-8 z-20 text-blue-75"
          style={{
            transform:
              "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
            transformOrigin: "250px 140px",
            willChange: "transform",
          }}
        >
          {splitAndMapTextWithTags(
            animatedTitles[animatedTitleIndexRef.current.exit],
            "animate-tile-char-exit opacity-100",
          )}
        </h1>
        <h1
          className="hero-heading animate-tile-enter absolute bottom-6 right-8 z-20 text-blue-75"
          style={{
            transform:
              "perspective(1000px) translate3d(0px, -150px, 20px) rotateZ(-20deg) rotateX(60deg)",
            transformOrigin: "250px 140px",
            willChange: "transform",
          }}
        >
          {splitAndMapTextWithTags(
            animatedTitles[animatedTitleIndexRef.current.enter],
            "animate-tile-char-enter opacity-0",
          )}
        </h1>
      </div>

      <h1
        className="hero-heading animate-tile-exit absolute bottom-6 right-8 -z-10 text-black"
        style={{
          transform:
            "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
          transformOrigin: "250px 140px",
          willChange: "transform",
        }}
      >
        {splitAndMapTextWithTags(
          animatedTitles[animatedTitleIndexRef.current.exit],
          "animate-tile-char-exit opacity-100",
        )}
      </h1>
      <h1
        className="hero-heading animate-tile-enter absolute bottom-6 right-8 -z-10 text-black"
        style={{
          transform:
            "perspective(1000px) translate3d(0px, -150px, 20px) rotateZ(-20deg) rotateX(60deg)",
          transformOrigin: "250px 140px",
          willChange: "transform",
        }}
      >
        {splitAndMapTextWithTags(
          animatedTitles[animatedTitleIndexRef.current.enter],
          "animate-tile-char-enter opacity-0",
        )}
      </h1>
    </section>
  );
}
