"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useRef, useState } from "react";
import Button from "./ui/button";
import { TiLocationArrow } from "react-icons/ti";
import { cn } from "@/lib/utils";
import { useIsTouchOnlyDevice } from "@/hooks/use-is-touch-only-device";
import { defaultLinkToast } from "./ui/toast";
import { toast } from "react-toastify";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const navItems = [
  {
    label: "Nexus",
    icon: true,
  },
  {
    label: "Vault",
    icon: true,
  },
  {
    label: "Prologue",
  },
  {
    label: "About",
  },
  {
    label: "Contact",
  },
];

export default function Navbar() {
  const isTouchOnlyDevice = useIsTouchOnlyDevice();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navBackgroundRef = useRef<HTMLDivElement>(null);
  const navLinksContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navLinkBackgroundRef = useRef<HTMLDivElement>(null);
  // const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrollYTop, setScrollYTop] = useState(true);

  function toggleAudio() {
    const audio = audioRef.current;

    if (!audio) return;

    if (!isAudioPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    setIsAudioPlaying((prev) => !prev);
  }

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.progress === 0) {
          setIsNavVisible(true);
          setScrollYTop(true);
        }

        if (self.direction === 1 && self.progress !== 0) {
          setIsNavVisible(false);
          setScrollYTop(false);
        }

        if (self.direction === -1) {
          setIsNavVisible(true);
        }
      },
    });
  });

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        duration: 0.5,
        ease: "power1.out",
      });

      tl.to(
        navBackgroundRef.current,
        {
          autoAlpha: isScrollYTop ? 0 : 1,
          duration: 0.2,
        },
        ">",
      );
    },
    { dependencies: [isNavVisible, isScrollYTop] },
  );

  useGSAP((_, contextSafe) => {
    if (isTouchOnlyDevice) return;

    const controller = new AbortController();
    const nav = navRef.current;
    const navLinksContainer = navLinksContainerRef.current;
    const navLinks = linkRefs.current;
    const navLinkBackground = navLinkBackgroundRef.current;

    if (
      !nav ||
      !navLinksContainer ||
      !navLinks ||
      !navLinkBackground ||
      !contextSafe
    )
      return;

    let isFirstMouseEnter = true;
    let linkMouseEnterTl: gsap.core.Timeline;
    let setTextBlackTime = 0;

    function getNavRect() {
      return nav!.getBoundingClientRect();
    }

    const handleMouseEnter = contextSafe((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const targetRect = target.getBoundingClientRect();
      const navRect = getNavRect();

      const linkBackgroundLeft = targetRect.left - navRect.left;
      const linkBackgroundHeight = targetRect.height;
      const linkBackgroundWidth = targetRect.width;

      if (isFirstMouseEnter) {
        gsap.set(navLinkBackground, {
          left: linkBackgroundLeft,
          height: linkBackgroundHeight,
          width: linkBackgroundWidth,
          autoAlpha: 1,
        });

        gsap.set(target, {
          color: "black",
        });

        isFirstMouseEnter = false;
      }

      if (!isFirstMouseEnter) {
        const tl = gsap.timeline({ defaults: { duration: 0.3 } });
        linkMouseEnterTl = tl;

        tl.to(navLinkBackground, {
          left: linkBackgroundLeft,
          height: linkBackgroundHeight,
          width: linkBackgroundWidth,
        });

        setTextBlackTime = tl.duration();

        tl.set(
          target,
          {
            color: "black",
          },
          "<0.15",
        );
      }
    });

    const handleMouseLeave = contextSafe((e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (linkMouseEnterTl.time() < setTextBlackTime) {
        // The text gets set to black with a 0.15s delay in the mouse enter event.
        // If the mouse leaves before this, the text will get set to the original color (below) and then to black after the delay.
        // Therefore, clear the timeline if the linkMouseEnterTl has not completed.
        linkMouseEnterTl.clear();
      }

      const linkLabelColor = `hsl(${getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim()
        .split(" ")
        .join(", ")})`;

      gsap.set(target, {
        color: linkLabelColor,
      });
    });

    const handleContainerMouseLeave = contextSafe(() => {
      isFirstMouseEnter = true;

      gsap.set(navLinkBackground, {
        autoAlpha: 0,
      });
    });

    navLinksContainer.addEventListener(
      "mouseleave",
      handleContainerMouseLeave,
      { signal: controller.signal },
    );
    navLinks.forEach((link) => {
      link?.addEventListener("mouseenter", handleMouseEnter, {
        signal: controller.signal,
      });
    });
    navLinks.forEach((link) => {
      link?.addEventListener("mouseleave", handleMouseLeave, {
        signal: controller.signal,
      });
    });

    return () => {
      controller.abort();
    };
  });

  return (
    <div
      id="navbar"
      ref={navContainerRef}
      className="fixed inset-x-2 z-50 sm:inset-x-4"
      style={{ willChange: "transform" }}
    >
      <div className="relative mt-2 overflow-hidden rounded-lg">
        <div
          ref={navBackgroundRef}
          className="absolute inset-0 rounded-lg border border-border bg-black opacity-0"
          style={{ willChange: "opacity" }}
        />
        <nav
          ref={navRef}
          className="relative flex size-full items-center justify-between p-4"
        >
          <div className="flex w-full items-center justify-between md:justify-start md:gap-8">
            <svg aria-hidden="true" className="size-8 fill-secondary">
              <use href="/icons/arrows-icon.svg#arrows-icon"></use>
            </svg>
            <div className="flex items-center justify-center gap-6">
              <Button
                id="product-button"
                variant="secondary"
                size="small"
                onClick={() => defaultLinkToast()}
              >
                Products
                <TiLocationArrow className="rotate-[135deg]" />
              </Button>
              <button
                onClick={() => toast.info("Menu coming soon!")}
                className="size-6 md:hidden"
              >
                <span className="sr-only">Toggle Menu</span>
                <svg aria-hidden="true" className="size-full fill-secondary">
                  <use href="/icons/burger-icon.svg#burger-icon"></use>
                </svg>
              </button>
              {/* {!isNavMenuOpen ? (
                <button
                  onClick={() => setIsNavMenuOpen(true)}
                  className="size-6 md:hidden"
                >
                  <span className="sr-only">Toggle Menu</span>
                  <svg aria-hidden="true" className="size-full fill-secondary">
                    <use href="/icons/burger-icon.svg#burger-icon"></use>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setIsNavMenuOpen(false)}
                  className="size-6 md:hidden"
                >
                  <span className="sr-only">Toggle Menu</span>
                  <svg aria-hidden="true" className="size-full">
                    <use href="/icons/close-icon.svg#close-icon"></use>
                  </svg>
                </button>
              )} */}
            </div>
          </div>
          <div
            ref={navLinkBackgroundRef}
            className="pointer-events-none absolute z-40 hidden rounded-3xl bg-secondary md:block"
            style={{ willChange: "opacity, transform" }}
          />
          <ul className="z-50 hidden items-center md:flex">
            <div ref={navLinksContainerRef} className="flex">
              {navItems.map((item, index) => {
                return (
                  <li key={index}>
                    <a
                      onClick={() => defaultLinkToast()}
                      ref={(el) => {
                        linkRefs.current[index] = el;
                      }}
                      className="flex cursor-pointer items-center gap-1 px-4 py-2 text-xs font-semibold uppercase text-foreground"
                    >
                      {item.label}
                      {item.icon && <TiLocationArrow />}
                    </a>
                  </li>
                );
              })}
            </div>
            <li>
              <button
                onClick={toggleAudio}
                className="flex items-center space-x-0.5 px-4 py-2"
              >
                <audio
                  ref={audioRef}
                  src="/audio/loop.mp3"
                  loop
                  className="hidden"
                />
                {Array.from(Array(5)).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "audio-indicator-line h-1 w-px rounded-full bg-foreground transition-all duration-200 ease-in-out",
                      {
                        active: isAudioPlaying,
                      },
                    )}
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  />
                ))}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
