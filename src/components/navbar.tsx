"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { TiLocationArrow } from "react-icons/ti";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const navItems = [
  {
    label: "Nexus",
    icon: TiLocationArrow,
  },
  {
    label: "Vault",
    icon: TiLocationArrow,
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
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navBackgroundRef = useRef<HTMLDivElement>(null);
  const navLinksContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const navLinkBackgroundRef = useRef<HTMLDivElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrollYTop, setScrollYTop] = useState(true);
  const isFirstMouseEnterRef = useRef(true);

  useEffect(() => {
    if (!audioElementRef.current) return;

    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

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
          opacity: isScrollYTop ? 0 : 1,
          duration: 0.2,
        },
        ">",
      );
    },
    { dependencies: [isNavVisible, isScrollYTop] },
  );

  function toggleAudio() {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  }

  useGSAP((_, contextSafe) => {
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

    function getNavRect() {
      return nav!.getBoundingClientRect();
    }

    let linkMouseEnterTl: gsap.core.Timeline;
    let setTextBlackTime = 0;

    const handleMouseEnter = contextSafe((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const targetRect = target.getBoundingClientRect();
      const navRect = getNavRect();

      const linkBackgroundLeft = targetRect.left - navRect.left;
      const linkBackgroundHeight = targetRect.height;
      const linkBackgroundWidth = targetRect.width;

      if (isFirstMouseEnterRef.current) {
        gsap.set(navLinkBackground, {
          left: linkBackgroundLeft,
          height: linkBackgroundHeight,
          width: linkBackgroundWidth,
          opacity: 1,
        });

        gsap.set(target, {
          color: "black",
        });

        isFirstMouseEnterRef.current = false;
      }

      if (!isFirstMouseEnterRef.current) {
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
        // If the mouse leaves before this, the text will get set to white (below) and then to black after the delay.
        // Therefore, clear the timeline if the linkMouseEnterTl has not completed.
        linkMouseEnterTl.clear();
      }

      gsap.set(target, {
        color: "white",
      });
    });

    const handleContainerMouseLeave = contextSafe(() => {
      isFirstMouseEnterRef.current = true;

      gsap.set(navLinkBackground, {
        opacity: 0,
      });
    });

    navLinksContainer.addEventListener("mouseleave", handleContainerMouseLeave);
    navLinks.forEach((link) => {
      link?.addEventListener("mouseenter", handleMouseEnter);
    });
    navLinks.forEach((link) => {
      link?.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      navLinksContainer.removeEventListener(
        "mouseleave",
        handleContainerMouseLeave,
      );
      navLinks.forEach((link) => {
        link?.removeEventListener("mouseenter", handleMouseEnter);
      });
      navLinks.forEach((link) => {
        link?.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  });

  return (
    <div ref={navContainerRef} className="fixed z-50 sm:inset-x-4">
      <div className="relative mt-2 overflow-hidden rounded-lg">
        <div
          ref={navBackgroundRef}
          className="absolute inset-0 rounded-lg border border-neutral-800 bg-black opacity-0"
        />
        <nav
          ref={navRef}
          className="relative flex size-full items-center justify-between p-4"
        >
          <div className="flex items-center gap-7">
            <Image
              src="/img/zentry-symbol-white.png"
              alt="logo"
              width={60}
              height={60}
              className="absolute left-1 top-0"
            />
            <Button
              id="product-button"
              rightIcon={<TiLocationArrow className="rotate-[135deg]" />}
              className="ml-16 bg-blue-50 px-4 py-2"
            >
              Products
            </Button>
          </div>
          <div
            ref={navLinkBackgroundRef}
            className="pointer-events-none absolute z-40 rounded-3xl bg-white"
          />
          <ul className="z-50 hidden items-center md:flex">
            <div ref={navLinksContainerRef} className="flex">
              {navItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li key={index}>
                    <a
                      href={`#${item.label.toLowerCase()}`}
                      ref={(el) => {
                        linkRefs.current[index] = el;
                      }}
                      className="flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase text-white"
                    >
                      {item.label}
                      {Icon && <Icon />}
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
                  ref={audioElementRef}
                  src="/audio/loop.mp3"
                  loop
                  className="hidden"
                />
                {Array.from(Array(5)).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "indicator-line h-1 w-px rounded-full bg-white transition-all duration-200 ease-in-out",
                      {
                        active: isIndicatorActive,
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
