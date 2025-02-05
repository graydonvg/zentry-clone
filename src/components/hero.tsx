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
import { useIsTouchOnlyDevice } from "@/hooks/use-is-touch-only-device";
import useAssetsStore from "@/lib/store/use-assets-store";
import useIsClient from "@/hooks/use-is-client";
import usePreloaderStore from "@/lib/store/use-preloader-store";
import { defaultLinkToast } from "./ui/toast";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const heroVideos = [
  {
    initialZIndex: 10,
    autoPlay: true,
    src: "/videos/hero-1.mp4",
  },
  {
    initialZIndex: 20,
    src: "/videos/hero-2.mp4",
  },
  {
    initialZIndex: -10,
    initialDisplay: "none",
    src: "/videos/hero-3.mp4",
  },
  {
    initialZIndex: -10,
    initialDisplay: "none",
    src: "/videos/hero-4.mp4",
  },
];

const animatedTitles = [
  "g<b>a</b>ming",
  "ide<b>n</b>tity",
  "re<b>a</b>lity",
  "ag<b>e</b>ntic ai",
];

export default function Hero() {
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
  const isScrolledToTopRef = useRef(true);
  const totalVideos = heroVideos.length;
  const previousVideoNumber =
    (currentVideoNumber - 1 + totalVideos) % totalVideos;
  const nextVideoNumber = (currentVideoNumber + 1) % totalVideos;
  const minMaxHitAreaSideLength = getHitAreaSideLength(windowDimensions);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const toggleHeroVideoAssetsLoaded = useAssetsStore(
    (state) => state.toggleHeroVideoAssetsLoaded,
  );
  const isPreloaderComplete = usePreloaderStore(
    (state) => state.isPreloaderComplete,
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
  }, [windowDimensions, minMaxHitAreaSideLength]);

  function handleHitAreaClicked() {
    if (isTransitioningRef.current || !isScrolledToTopRef.current) return;

    isTransitioningRef.current = true;
    setHasClickedHitArea(true);
    animatedTitleIndexRef.current = {
      exit: currentVideoNumber,
      enter: nextVideoNumber,
    };
    setCurrentVideoNumber((prevIndex) => (prevIndex + 1) % totalVideos);
  }

  // Next video button animation for touch only device
  useGSAP(
    () => {
      const nextVideoItemContent =
        videoItemContentRefs.current[nextVideoNumber];
      const nextVideoBorder = videoItemBorderRefs.current[nextVideoNumber];
      const hitArea = hitAreaRef.current;

      if (
        !isTouchOnlyDevice ||
        !isPreloaderComplete ||
        !nextVideoItemContent ||
        !nextVideoBorder ||
        !hitArea
      )
        return;

      const tl = gsap
        .timeline()
        .to(
          hitArea,
          {
            scale: 1.1,
            ease: "power2.out",
            duration: 1,
          },
          0,
        )
        .to(
          nextVideoItemContent,
          {
            clipPath: () =>
              `path("${getNextVideoClipPath(minMaxHitAreaSideLength * 1.1, windowDimensions)}")`,
            ease: "power2.out",
            duration: 1,
          },
          0,
        )
        .to(
          nextVideoBorder,
          {
            ease: "power2.out",
            duration: 1,
            attr: {
              d: () =>
                getNextVideoClipPath(
                  minMaxHitAreaSideLength * 1.1,
                  windowDimensions,
                ),
            },
          },
          0,
        )
        .to(
          hitArea,
          {
            scale: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          },
          ">",
        )
        .to(
          nextVideoItemContent,
          {
            clipPath: () => `path("${nextVideoClipPath}")`,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          },
          "<",
        )
        .to(
          nextVideoBorder,
          {
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            attr: {
              d: () => nextVideoClipPath,
            },
          },
          "<",
        );

      ScrollTrigger.create({
        start: "top",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.progress === 0) {
            if (!isScrolledToTopRef.current) {
              isScrolledToTopRef.current = true;
              tl.restart();
            }
          } else {
            if (isScrolledToTopRef.current) {
              isScrolledToTopRef.current = false;
              tl.pause();

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
          }
        },
      });
    },
    {
      dependencies: [
        nextVideoNumber,
        nextVideoClipPath,
        hiddenVideoClipPath,
        isTouchOnlyDevice,
        isPreloaderComplete,
      ],
      revertOnUpdate: true,
    },
  );

  // Next video button animation for pointer-based device
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
        !isPreloaderComplete ||
        !nextVideoItemContent ||
        !nextVideo ||
        !nextVideoBorder ||
        !hitArea ||
        !fakeHitArea ||
        isTouchOnlyDevice ||
        !contextSafe
      )
        return;

      gsap.set(hitArea, {
        scale: 0,
        translateX: 0,
        translateY: 0,
      });
      gsap.set(nextVideoItemContent, {
        clipPath: () => `path("${hiddenVideoClipPath}")`,
      });
      gsap.set(nextVideoBorder, {
        attr: {
          d: () => hiddenVideoClipPath,
        },
      });

      let isMouseOverHitArea = false;
      let timeout: NodeJS.Timeout | null = null;

      ScrollTrigger.create({
        start: "top",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.progress === 0) {
            if (!isScrolledToTopRef.current) {
              isScrolledToTopRef.current = true;
            }
          } else {
            if (isScrolledToTopRef.current) {
              isScrolledToTopRef.current = false;

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
          }
        },
      });

      const shrink = contextSafe(() => {
        if (isScrolledToTopRef.current && isMouseOverHitArea) return;

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

        if (!isScrolledToTopRef.current) return;

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
              clipPath: () =>
                `path("${getNextVideoClipPath(
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
                d: () =>
                  getNextVideoClipPath(
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
        isPreloaderComplete,
        nextVideoNumber,
        hiddenVideoClipPath,
        isTouchOnlyDevice,
      ],
      revertOnUpdate: true,
    },
  );

  // Cycle vids on next video button click
  useGSAP(
    () => {
      const videoItemContainer = videoItemContainerRefs.current;
      const videoItemContent = videoItemContentRefs.current;
      const nextVideo = videoRefs.current;
      const videoItemBorder = videoItemBorderRefs.current;
      const video = videoRefs.current;
      const hitArea = hitAreaRef.current;

      if (
        !videoItemContainer ||
        !videoItemContent ||
        !nextVideo ||
        !videoItemBorder ||
        !video ||
        !hitArea ||
        !hasClickedHitArea
      )
        return;

      // Ensure hit area remains at full scale
      gsap.set(hitArea, {
        scale: 1,
      });

      // Keep past videos hidden
      const hiddenVideoNumbers = getHiddenHeroVideoNumbers(
        currentVideoNumber,
        totalVideos,
      );

      hiddenVideoNumbers.forEach((hiddenVideoNumber) => {
        gsap.set(videoItemContainer[hiddenVideoNumber], {
          display: "none",
          zIndex: -10,
        });
      });

      // Keep the previous video visible during transition
      gsap.set(videoItemContainer[previousVideoNumber], {
        display: "block",
        zIndex: -10,
      });
      gsap.set(videoItemContent[previousVideoNumber], {
        clipPath: `path("${fullScreenClipPath}")`,
      });

      // Set the new current video behind the next video button before it grows
      gsap.set(videoItemContainer[currentVideoNumber], {
        display: "block",
        zIndex: 10,
      });
      gsap.set(videoItemContent[currentVideoNumber], {
        clipPath: `path("${nextVideoClipPath}")`,
      });
      gsap.set(videoItemBorder[currentVideoNumber], {
        attr: {
          d: nextVideoClipPath,
        },
      });

      // Set the next video button in front of the new current video
      gsap.set(videoItemContainer[nextVideoNumber], {
        display: "block",
        zIndex: 20,
      });
      gsap.set(videoItemContent[nextVideoNumber], {
        clipPath: `path("${hiddenVideoClipPath}")`,
      });

      // Animate the new current video border to expand to the size of the screen
      gsap.to(videoItemBorder[currentVideoNumber], {
        attr: {
          d: fullScreenClipPath,
        },
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // Remove the border once the video grows to full size
          gsap.set(videoItemBorder[currentVideoNumber], {
            attr: {
              d: "",
            },
          });
        },
      });

      // Animate the new current video to expand to the size of the screen
      gsap.to(videoItemContent[currentVideoNumber], {
        clipPath: `path("${fullScreenClipPath}")`,
        duration: 1,
        ease: "power2.out",
        onStart: () => {
          const currentVideo = video[currentVideoNumber];

          if (currentVideo) {
            currentVideo.play();
          }
        },
        onComplete: () => {
          // Hide the previous video once the new current video grows to full size
          gsap.set(videoItemContainer[previousVideoNumber], {
            display: "none",
          });

          const previousVideo = video[previousVideoNumber];

          if (previousVideo) {
            previousVideo.pause();
            previousVideo.currentTime = 0;
          }
          isTransitioningRef.current = false;
          setHasClickedHitArea(false);
        },
      });

      if (isTouchOnlyDevice) return;
      // Reveal the next video button
      gsap.to(videoItemContent[nextVideoNumber], {
        clipPath: `path("${nextVideoClipPath}")`,
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(videoItemBorder[nextVideoNumber], {
        attr: {
          d: nextVideoClipPath,
        },
        duration: 1,
        ease: "power2.out",
      });
    },
    {
      dependencies: [currentVideoNumber],
      revertOnUpdate: true,
    },
  );

  // Animate heading on next video button click
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const breakPoint = 768;

      if (!hasClickedHitArea) return;

      let tl: gsap.core.Timeline | null = null;

      mm.add(
        {
          isAboveMedium: `(min-width: ${breakPoint}px) `,
          isBelowMedium: `(max-width: ${breakPoint - 0.01}px) `,
        },
        (context) => {
          if (!context.conditions) return;
          const { isAboveMedium } = context.conditions;

          const hiddenExitTarget = isAboveMedium
            ? ".heading-top-exit"
            : ".heading-bottom-exit";
          const hiddenEnterTarget = isAboveMedium
            ? ".heading-top-enter"
            : ".heading-bottom-enter";
          const visibleExitTarget = isAboveMedium
            ? ".heading-bottom-exit"
            : ".heading-top-exit";
          const visibleEnterTarget = isAboveMedium
            ? ".heading-bottom-enter"
            : ".heading-top-enter";

          if (!tl) {
            tl = gsap.timeline();
          }

          tl.set(hiddenExitTarget, { display: "none" }, 0)
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
              ".heading-char-exit",
              { autoAlpha: 1 },
              {
                autoAlpha: 0,
                duration: 0.01,
                stagger: {
                  amount: 0.4,
                },
              },
              "<+=0.2",
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
              "<+=0.2",
            )
            .fromTo(
              ".heading-char-enter",
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                duration: 0.01,
                stagger: {
                  amount: 0.6,
                },
              },
              "<",
            );
        },
      );
    },

    { dependencies: [hasClickedHitArea] },
  );

  // Animate hero clip path on scroll
  useGSAP(
    () => {
      const hero = heroRef.current;
      const heroBorder = heroBorderRef.current;

      if (!hero || !heroBorder) return;

      const fullScreenClipPath = getFullScreenClipPath(windowDimensions);
      const firstTransformedHeroClipPath =
        getFirstTransformedHeroClipPath(windowDimensions);
      const secondTransformedHeroClipPath =
        getSecondTransformedHeroClipPath(windowDimensions);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
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
          hero,
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
          heroBorder,
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
          hero,
          {
            clipPath: `path("${secondTransformedHeroClipPath}")`,
            ease: "power1.inOut",
          },
          ">",
        )
        .to(
          heroBorder,
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
      dependencies: [windowDimensions],
      revertOnUpdate: true,
    },
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div
        ref={heroRef}
        className="absolute left-0 top-0 size-full overflow-hidden"
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
                className="absolute left-0 top-0 z-10 size-full overflow-hidden bg-primary"
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

        <div className="absolute left-0 top-0 z-10 size-full px-[clamp(1rem,6vw,3rem)] md:z-20">
          <h1 className="hero-heading-sml md:hero-heading-lrg hero-heading-enter-preloader mt-24 text-foreground">
            {splitAndMapTextWithTags(
              "redefi<b>n</b>e",
              "hero-heading-chars-enter-preloader opacity-0 invisible",
            )}
            <span className="inline-flex md:hidden">
              <span
                className="hero-heading-sml heading-top-exit absolute right-0 text-foreground"
                style={{
                  transform:
                    "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
                  transformOrigin: "140px 80px",
                  willChange: "transform",
                }}
              >
                {splitAndMapTextWithTags(
                  animatedTitles[animatedTitleIndexRef.current.exit],
                  "heading-char-exit opacity-100",
                )}
              </span>
              <span
                className="hero-heading-sml heading-top-enter absolute right-0 hidden text-foreground"
                style={{
                  transform:
                    "perspective(1000px) translate3d(-110px, 50px, -60px) rotateY(-50deg) rotateX(-20deg)",
                  transformOrigin: "140px 80px",
                  willChange: "transform",
                }}
              >
                {splitAndMapTextWithTags(
                  animatedTitles[animatedTitleIndexRef.current.enter],
                  "heading-char-enter opacity-0 invisible",
                )}
              </span>
            </span>
          </h1>

          <p className="hero-cta-enter-preloader mb-5 hidden font-robert-regular text-body-lg/[1.2] text-foreground md:block">
            Enter the Metagame
            <br />
            Unleash the Play Economy
          </p>
          <Button
            onClick={() => defaultLinkToast()}
            leftIcon={leftIcon}
            className="hero-cta-enter-preloader hidden md:flex"
          >
            Watch Trailer
          </Button>
        </div>

        <div className="absolute inset-0 z-10 hidden h-svh w-full md:block">
          <h1
            className="hero-heading-lrg heading-bottom-exit hero-heading-enter-preloader absolute bottom-6 right-8 text-foreground"
            style={{
              transform:
                "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
              transformOrigin: "250px 140px",
              willChange: "transform",
            }}
          >
            {splitAndMapTextWithTags(
              animatedTitles[animatedTitleIndexRef.current.exit],
              "heading-char-exit opacity-100 hero-heading-chars-enter-preloader",
            )}
          </h1>
          <h1
            className="hero-heading-lrg heading-bottom-enter absolute bottom-6 right-8 text-foreground"
            style={{
              transform:
                "perspective(1000px) translate3d(0px, -150px, 20px) rotateZ(-20deg) rotateX(60deg)",
              transformOrigin: "250px 140px",
              willChange: "transform",
            }}
          >
            {splitAndMapTextWithTags(
              animatedTitles[animatedTitleIndexRef.current.enter],
              "heading-char-enter opacity-0 invisible",
            )}
          </h1>
        </div>
        <div className="absolute inset-0 z-20 flex h-svh w-full items-end justify-between px-[clamp(1rem,6vw,3rem)] pb-[clamp(1rem,6vw,3rem)] md:hidden">
          <p className="hero-cta-enter-preloader font-robert-regular text-body-sm/[1.2] text-foreground">
            Enter the Metagame
            <br />
            Unleash the Play Economy
          </p>
          <Button
            onClick={() => defaultLinkToast()}
            leftIcon={leftIcon}
            className="hero-cta-enter-preloader"
          >
            Trailer
          </Button>
        </div>
      </div>

      <h1
        className="hero-heading-lrg heading-bottom-exit absolute bottom-6 right-8 -z-10 hidden text-black md:block"
        style={{
          transform:
            "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
          transformOrigin: "250px 140px",
          willChange: "transform",
        }}
      >
        {splitAndMapTextWithTags(
          animatedTitles[animatedTitleIndexRef.current.exit],
          "heading-char-exit opacity-100",
        )}
      </h1>
      <h1
        className="hero-heading-lrg heading-bottom-enter absolute bottom-6 right-8 -z-10 hidden text-black md:block"
        style={{
          transform:
            "perspective(1000px) translate3d(0px, -150px, 20px) rotateZ(-20deg) rotateX(60deg)",
          transformOrigin: "250px 140px",
          willChange: "transform",
        }}
      >
        {splitAndMapTextWithTags(
          animatedTitles[animatedTitleIndexRef.current.enter],
          "heading-char-enter opacity-0 invisible",
        )}
      </h1>
    </section>
  );
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
