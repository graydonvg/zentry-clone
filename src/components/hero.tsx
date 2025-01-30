"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./ui/button";
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
import { ListBlobResultBlob } from "@vercel/blob";
import { useIsTouchOnlyDevice } from "@/hooks/use-is-touch-only-device";
import useAssetsStore from "@/lib/store/use-assets-store";
import useIsClient from "@/hooks/use-is-client";

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
  "ag<b>e</b>ntic ai",
];

type Props = {
  heroVideosBlob: ListBlobResultBlob[];
};

export default function Hero({ heroVideosBlob }: Props) {
  const isTouchOnlyDevice = useIsTouchOnlyDevice();
  const windowDimensions = useWindowDimensions();
  const isClient = useIsClient();
  const [currentVideoNumber, setCurrentVideoNumber] = useState(0);
  const [hasClickedHitArea, setHasClickedHitArea] = useState(false);
  const [hitAreaSideLength, setHitAreaSideLength] = useState<string | number>(
    "20%",
  );
  const [hiddenVideoClipPath, setHiddenVideoClipPath] = useState("");
  const [nextVideoClipPath, setNextVideoClipPath] = useState("");
  const [fullScreenClipPath, setFullScreenClipPath] = useState("");
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
  const [loadedVideos, setLoadedVideos] = useState(0);
  const toggleHeroVideoAssetsLoaded = useAssetsStore(
    (state) => state.toggleHeroVideoAssetsLoaded,
  );
  const heroVideoAssetsLoaded = useAssetsStore(
    (state) => state.heroVideoAssetsLoaded,
  );
  const leftIcon = useMemo(
    () => <TiLocationArrow className="size-4 rotate-45" />,
    [],
  );

  useEffect(() => {
    if (loadedVideos === totalVideos) {
      toggleHeroVideoAssetsLoaded();
    }
  }, [loadedVideos, totalVideos, toggleHeroVideoAssetsLoaded]);

  useEffect(() => {
    setNextVideoClipPath(
      getNextVideoClipPath(minMaxHitAreaSideLength, windowDimensions),
    );
    setFullScreenClipPath(getFullScreenClipPath(windowDimensions));
    setHiddenVideoClipPath(getNextVideoClipPath(0, windowDimensions));
    setHitAreaSideLength(minMaxHitAreaSideLength);
    setFirstTransformedHeroClipPath(
      getFirstTransformedHeroClipPath(windowDimensions),
    );
    setSecondTransformedHeroClipPath(
      getSecondTransformedHeroClipPath(windowDimensions),
    );
  }, [windowDimensions, minMaxHitAreaSideLength, heroVideoAssetsLoaded]);

  function handleHitAreaClicked() {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setHasClickedHitArea(true);
    animatedTitleIndexRef.current = {
      exit: currentVideoNumber,
      enter: nextVideoNumber,
    };
    setCurrentVideoNumber((prevIndex) => (prevIndex + 1) % totalVideos);
  }

  // Set next video and hit area initial clip path and scale
  useGSAP(
    () => {
      if (!isTouchOnlyDevice) {
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
    {
      dependencies: [nextVideoClipPath, hiddenVideoClipPath, isTouchOnlyDevice],
      revertOnUpdate: true,
    },
  );

  // Grow/shrink, parallax tilt and translate next video option on mouse move
  useGSAP(
    (_context, contextSafe) => {
      const controller = new AbortController();
      const nextVideoItemContent =
        videoItemContentRefs.current[nextVideoNumber];
      const nextVideo = videoRefs.current[nextVideoNumber];
      const nextVideoBorder = videoItemBorderRefs.current[nextVideoNumber];
      const hitArea = hitAreaRef.current;
      const fakeHitArea = fakeHitAreaRef.current;

      if (
        !nextVideoItemContent ||
        !nextVideo ||
        !nextVideoBorder ||
        !hitArea ||
        !fakeHitArea ||
        isTouchOnlyDevice ||
        !contextSafe
      )
        return;

      let isScrolledToTop = true;
      let isMouseOverHitArea = false;
      let timeout: NodeJS.Timeout | null = null;

      ScrollTrigger.create({
        start: "top",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.progress === 0) {
            isScrolledToTop = true;
          } else {
            isScrolledToTop = false;

            gsap.to(hitArea, {
              scale: 0,
              duration: 1,
            });
            gsap.to(nextVideoItemContent, {
              clipPath: `path("${hiddenVideoClipPath}")`,
              duration: 1,
            });
            gsap.to(nextVideoBorder, {
              attr: {
                d: hiddenVideoClipPath,
              },
              duration: 1,
            });
          }
        },
      });

      const shrink = contextSafe(() => {
        if (isScrolledToTop && isMouseOverHitArea) return;

        gsap
          .timeline({ defaults: { duration: 1 } })
          .to(
            hitArea,
            {
              scale: 0,
              translateX: 0,
              translateY: 0,
            },
            0,
          )
          .to(
            nextVideoItemContent,
            {
              clipPath: `path("${hiddenVideoClipPath}")`,
            },
            0,
          )
          .to(
            nextVideoBorder,
            {
              attr: {
                d: hiddenVideoClipPath,
              },
            },
            0,
          );
      });

      const handleMouseMove = contextSafe((e: MouseEvent) => {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          shrink();
        }, 300);

        if (!isScrolledToTop) return;

        const rotateIntensity = 20;
        const translateHitAreaIntensity = 0.25;

        const fakeHitAreaRect = fakeHitArea.getBoundingClientRect();

        const hitAreaCenterX = fakeHitAreaRect.left + fakeHitAreaRect.width / 2;
        const hitAreaCenterY = fakeHitAreaRect.top + fakeHitAreaRect.height / 2;

        const translateHitAreaX =
          (e.clientX - hitAreaCenterX) * translateHitAreaIntensity;
        const translateHitAreaY =
          (e.clientY - hitAreaCenterY) * translateHitAreaIntensity;

        const relativeX = e.clientX / windowDimensions.width; // Horizontal position (0 to 1)
        const relativeY = e.clientY / windowDimensions.height; // Vertical position (0 to 1)

        const rotateOffsetX = relativeX - 0.5; // Horizontal offset (-0.5 to 0.5)
        const rotateOffsetY = relativeY - 0.5; // Vertical offset (-0.5 to 0.5)

        let rotateX = rotateOffsetY * -rotateIntensity; // Vertical tilt
        let rotateY = rotateOffsetX * rotateIntensity; // Horizontal tilt

        // Clamp the values
        rotateX = Math.max(-5, Math.min(5, rotateX));
        rotateY = Math.max(-5, Math.min(5, rotateY));

        const translateClipPathX =
          ((e.clientX - fakeHitAreaRect.left) / fakeHitAreaRect.width - 0.5) *
          0.5;
        const translateClipPathY =
          ((e.clientY - fakeHitAreaRect.top) / fakeHitAreaRect.height - 0.5) *
          0.5;

        gsap
          .timeline({ defaults: { duration: 1 } })
          .to(
            hitArea,
            {
              scale: 1,
              translateX: translateHitAreaX,
              translateY: translateHitAreaY,
            },
            0,
          )
          .to(
            nextVideoItemContent,
            {
              rotateX,
              rotateY,
              clipPath: `path("${getNextVideoClipPath(
                minMaxHitAreaSideLength,
                windowDimensions,
                { x: translateClipPathX, y: translateClipPathY },
              )}")`,
            },
            0,
          )
          .to(
            nextVideoBorder,
            {
              attr: {
                d: getNextVideoClipPath(
                  minMaxHitAreaSideLength,
                  windowDimensions,
                  {
                    x: translateClipPathX,
                    y: translateClipPathY,
                  },
                ),
              },
            },
            0,
          )
          .to(
            nextVideo,
            {
              rotateX: -rotateX,
              rotateY: -rotateY,
            },
            0,
          );
      });

      function handleHitAreaMouseMove() {
        if (isMouseOverHitArea) return;
        isMouseOverHitArea = true;
      }

      function handleHitAreaMouseLeave() {
        isMouseOverHitArea = false;
      }

      window.addEventListener("mousemove", handleMouseMove, {
        signal: controller.signal,
      });
      hitArea.addEventListener("mousemove", handleHitAreaMouseMove, {
        signal: controller.signal,
      });
      hitArea.addEventListener("mouseleave", handleHitAreaMouseLeave, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();

        if (timeout) {
          clearTimeout(timeout);
        }
      };
    },
    {
      dependencies: [
        nextVideoNumber,
        hiddenVideoClipPath,
        minMaxHitAreaSideLength,
        windowDimensions,
        isTouchOnlyDevice,
      ],
      revertOnUpdate: true,
    },
  );

  // Cycle vids on click
  useGSAP(
    () => {
      if (hasClickedHitArea) {
        // Ensure hit area remains at full scale
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
          clipPath: `path("${fullScreenClipPath}")`,
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
            d: fullScreenClipPath,
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
          clipPath: `path("${fullScreenClipPath}")`,
          duration: 1,
          ease: "power2.out",
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
      const mm = gsap.matchMedia();
      const breakPoint = 768;

      if (!hasClickedHitArea) return;

      mm.add(
        {
          isAboveMedium: `(min-width: ${breakPoint}px) `,
          isBelowMedium: `(max-width: ${breakPoint - 0.01}px) `,
        },
        (context) => {
          if (!context.conditions) return;
          const { isAboveMedium } = context.conditions;

          const hiddenExitTarget = isAboveMedium
            ? ".animate-tile-top-exit"
            : ".animate-tile-bottom-exit";
          const hiddenEnterTarget = isAboveMedium
            ? ".animate-tile-top-enter"
            : ".animate-tile-bottom-enter";
          const visibleExitTarget = isAboveMedium
            ? ".animate-tile-bottom-exit"
            : ".animate-tile-top-exit";
          const visibleEnterTarget = isAboveMedium
            ? ".animate-tile-bottom-enter"
            : ".animate-tile-top-enter";

          gsap
            .timeline()
            .set(hiddenExitTarget, { display: "none" }, 0)
            .set(hiddenEnterTarget, { display: "none" }, 0)
            .fromTo(
              visibleExitTarget,
              {
                display: "block",
                transform:
                  "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
              },
              {
                display: "none",
                transform:
                  "perspective(1000px) translate3d(50%, 30px, 20px) rotateY(60deg) rotateX(-20deg)",
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
              visibleEnterTarget,
              {
                display: "none",
                transform: isAboveMedium
                  ? "perspective(1000px) translate3d(0px, -150px, 20px) rotateZ(-20deg) rotateX(60deg)"
                  : "perspective(1000px) translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
              },
              {
                display: "block",
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
        },
      );
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
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
              if (self.progress === 0) {
                gsap.to(heroBorderRef.current, {
                  autoAlpha: 0,
                });
              } else {
                gsap.to(heroBorderRef.current, {
                  autoAlpha: 1,
                });
              }
            },
          },
        })
        .fromTo(
          heroRef.current,
          {
            clipPath: `path("${fullScreenClipPath}")`,
          },
          {
            clipPath: `path("${firstTransformedHeroClipPath}")`,
            ease: "power1.inOut",
          },
          0,
        )
        .fromTo(
          heroBorderRef.current,
          {
            autoAlpha: 0,
            attr: {
              d: fullScreenClipPath,
            },
          },
          {
            attr: {
              d: firstTransformedHeroClipPath,
            },
            ease: "power1.inOut",
          },
          0,
        )
        .to(
          heroRef.current,
          {
            clipPath: `path("${secondTransformedHeroClipPath}")`,
            ease: "power1.inOut",
          },
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
          "<",
        );
    },
    {
      dependencies: [
        fullScreenClipPath,
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
              ? fullScreenClipPath
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
                className="absolute left-0 top-0 z-10 size-full overflow-hidden bg-accent"
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
                  {isClient && (
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
                      onLoadedData={() => setLoadedVideos((prev) => prev + 1)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute left-0 top-0 z-20 size-full px-[clamp(1rem,6vw,3rem)]">
          <h1 className="hero-heading-sml md:hero-heading-lrg mt-24 text-foreground">
            redefi<b>n</b>e
            <span className="inline-flex md:hidden">
              <span
                className="hero-heading-sml animate-tile-top-exit absolute right-[clamp(1rem,6vw,3rem)] text-foreground"
                style={{
                  transform:
                    "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
                  transformOrigin: "140px 80px",
                  willChange: "transform",
                }}
              >
                {splitAndMapTextWithTags(
                  animatedTitles[animatedTitleIndexRef.current.exit],
                  "animate-tile-char-exit opacity-100",
                )}
              </span>
              <span
                className="hero-heading-sml animate-tile-top-enter absolute right-[clamp(1rem,6vw,3rem)] hidden text-foreground"
                style={{
                  transform:
                    "perspective(1000px) translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
                  transformOrigin: "140px 80px",
                  willChange: "transform",
                }}
              >
                {splitAndMapTextWithTags(
                  animatedTitles[animatedTitleIndexRef.current.enter],
                  "animate-tile-char-enter opacity-0",
                )}
              </span>
            </span>
          </h1>

          <p className="mb-5 hidden font-robert-regular text-body-lg/[1.2] text-foreground md:block">
            Enter the Metagame
            <br />
            Unleash the Play Economy
          </p>
          <Button leftIcon={leftIcon} className="hidden md:flex">
            Watch Trailer
          </Button>
        </div>

        <div className="absolute inset-0 z-10 h-svh w-full">
          <h1
            className="hero-heading-lrg animate-tile-bottom-exit absolute bottom-6 right-8 hidden text-foreground md:block"
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
            className="hero-heading-lrg animate-tile-bottom-enter absolute bottom-6 right-8 hidden text-foreground md:block"
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
          <div className="absolute bottom-0 right-0 flex w-full items-center justify-between px-[clamp(1rem,6vw,3rem)] pb-[clamp(1rem,6vw,3rem)] md:hidden">
            <p className="font-robert-regular text-body-sm/[1.2] text-foreground">
              Enter the Metagame
              <br />
              Unleash the Play Economy
            </p>
            <Button leftIcon={leftIcon}>Trailer</Button>
          </div>
        </div>
      </div>

      <h1
        className="hero-heading-lrg animate-tile-bottom-exit absolute bottom-6 right-8 -z-10 hidden text-black md:block"
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
        className="hero-heading-lrg animate-tile-bottom-enter absolute bottom-6 right-8 -z-10 hidden text-black md:block"
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
