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
  const navRef = useRef<HTMLElement>(null);
  const navLinkContainerRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const navLinkOverlayRef = useRef<HTMLDivElement>(null);
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

      tl.to(navRef.current, {
        y: isNavVisible ? 0 : -100,
        duration: 0.5,
        ease: "power1.out",
      });

      tl.set(
        navRef.current,
        {
          backgroundColor: isScrollYTop ? "transparent" : "black",
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

  useGSAP(
    (_, contextSafe) => {
      if (!linkRefs.current || !contextSafe) return;

      const navLinkOverlay = navLinkOverlayRef.current;
      const navRect = navRef.current?.getBoundingClientRect();

      if (!navLinkOverlay || !navRect) return;

      const handleMouseEnter = contextSafe((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const targetRect = target.getBoundingClientRect();
        const tl = gsap.timeline({ defaults: { duration: 0.3 } });

        if (isFirstMouseEnterRef.current) {
          tl.set(navLinkOverlay, {
            left: targetRect.left - navRect.left,
            top: targetRect.top - navRect.top,
            height: targetRect.height,
            width: targetRect.width,
            opacity: 1,
          });
          tl.set(target, {
            color: "black",
          });

          isFirstMouseEnterRef.current = false;
        }

        if (!isFirstMouseEnterRef.current) {
          tl.to(navLinkOverlay, {
            left: targetRect.left - navRect.left,
            top: targetRect.top - navRect.top,
            height: targetRect.height,
            width: targetRect.width,
            opacity: 1,
          });

          tl.to(
            target,
            {
              color: "black",
            },
            "<",
          );
        }
      });

      const handleMouseLeave = contextSafe((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const tl = gsap.timeline({ defaults: { duration: 0.3 } });

        tl.to(navLinkOverlay, {
          opacity: 0,
        });

        tl.to(
          target,
          {
            color: "white",
          },
          "<",
        );
      });

      linkRefs.current.forEach((link) => {
        link?.addEventListener("mouseenter", handleMouseEnter);
      });
      linkRefs.current.forEach((link) => {
        link?.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        if (!linkRefs.current) return;

        linkRefs.current.forEach((link) => {
          link?.removeEventListener("mouseenter", handleMouseEnter);
        });
        linkRefs.current.forEach((link) => {
          link?.removeEventListener("mouseleave", handleMouseLeave);
        });
      };
    },
    { dependencies: [isFirstMouseEnterRef.current] },
  );

  return (
    <nav ref={navRef} className="fixed z-50 mt-4 rounded-lg sm:inset-x-6">
      <div className="relative flex size-full items-center justify-between overflow-hidden p-4">
        <div className="flex items-center gap-7">
          <Image src="/img/logo.png" alt="logo" width={40} height={40} />
          <Button
            id="product-button"
            rightIcon={<TiLocationArrow className="rotate-[135deg]" />}
            className="hidden bg-blue-50 md:flex"
          >
            Products
          </Button>
        </div>
        <div
          ref={navLinkOverlayRef}
          className="pointer-events-none absolute -z-10 rounded-3xl bg-white opacity-0"
        />
        <ul
          ref={navLinkContainerRef}
          onMouseLeave={() => {
            isFirstMouseEnterRef.current = true;
          }}
          className="hidden h-full items-center md:flex"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <li key={index}>
                <a
                  href={`#${item.label.toLowerCase()}`}
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white"
                >
                  {item.label}
                  {Icon && <Icon className="text-xs" />}
                </a>
              </li>
            );
          })}
          <li
            onMouseLeave={() => {
              isFirstMouseEnterRef.current = true;
            }}
          >
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
      </div>
    </nav>
  );
}
