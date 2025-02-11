"use client";

import { Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { defaultLinkToast } from "./ui/toast";
import { useEffect, useRef, useState } from "react";
import useMobileMenuStore from "@/lib/store/use-mobile-menu-store";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AudioButton from "./audio-button";
import Link from "next/link";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const mobileMenuItems = [
  {
    label: "<b>N</b>exus",
    icon: true,
  },
  {
    label: "Vault",
    icon: true,
  },
  {
    label: "Pr<b>o</b>logue",
  },
  {
    label: "<b>A</b>bout",
  },
  {
    label: "Conta<b>c</b>t",
  },
];

export default function MobileMenu() {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastMenuItemNumberRef = useRef<HTMLSpanElement>(null);
  const mobileMenuBottomRef = useRef<HTMLDivElement>(null);
  const mobileMenuBottomLinkRef = useRef<HTMLAnchorElement>(null);
  const menuOpenTlRef = useRef<gsap.core.Timeline | null>(null);
  const menuCloseTlRef = useRef<gsap.core.Timeline | null>(null);
  const { isMobileMenuOpen } = useMobileMenuStore();
  const [updatePadding, setUpdatePadding] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const lastMenuItemNumber = lastMenuItemNumberRef.current;
    const mobileMenuBottom = mobileMenuBottomRef.current;

    if (!mobileMenuBottom) return;

    const controller = new AbortController();

    function setMobileMenuBottomPadding() {
      const lastMenuItemNumberRect =
        lastMenuItemNumber!.getBoundingClientRect();
      const lastMenuItemNumberWidth = lastMenuItemNumberRect?.width;

      mobileMenuBottom!.style.paddingLeft = `${lastMenuItemNumberWidth ?? 0}px`;
    }

    setMobileMenuBottomPadding();

    window.addEventListener("resize", () => setMobileMenuBottomPadding(), {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [updatePadding]);

  useGSAP(
    () => {
      const mobileMenu = mobileMenuRef.current;
      const mobileMenuBottomLink = mobileMenuBottomLinkRef.current;

      if (!mobileMenu || !mobileMenuBottomLink) return;

      const foregroundColor = `hsl(${getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim()
        .split(" ")
        .join(", ")})`;
      const secondaryColor = `hsl(${getComputedStyle(document.documentElement)
        .getPropertyValue("--secondary")
        .trim()
        .split(" ")
        .join(", ")})`;

      if (isMobileMenuOpen) {
        if (menuCloseTlRef.current?.isActive()) {
          menuCloseTlRef.current?.pause();
        }

        if (!menuOpenTlRef.current)
          menuOpenTlRef.current = gsap.timeline({ paused: true });

        menuOpenTlRef.current
          .set(
            mobileMenu,
            {
              display: "flex",
              autoAlpha: 1,
            },
            0,
          )
          .set(
            "#mobile-menu-icon",
            {
              fill: "black",
            },
            0,
          )
          .set(
            "#navbar-background",
            {
              display: "none",
            },
            0,
          )
          .set(
            "#navbar-logo-svg",
            {
              fill: "black",
            },
            0,
          )
          .set(
            ".navbar-link",
            {
              color: "black",
            },
            0,
          )
          .set(
            ".audio-indicator-line",
            {
              backgroundColor: "black",
            },
            0,
          )
          .set(
            "#navbar-products-button",
            {
              color: foregroundColor,
              backgroundColor: "black",
            },
            0,
          )
          .fromTo(
            ".menu-item-label",
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              stagger: {
                amount: 0.3,
              },
              duration: 0.01,
            },
            0,
          )
          .fromTo(
            ".menu-item-label",
            {
              transform:
                "perspective(1000px) translate3d(-20vw, 5vh, -40px) rotateY(-50deg) rotateX(-20deg)",
            },
            {
              transform:
                "perspective(1000px) translate3d(0px, 0px, 0px) rotateY(0deg) rotateX(0deg)",
              stagger: {
                amount: 0.3,
              },
              ease: "power2.out",
              duration: 1.2,
              onStart: () => {
                setUpdatePadding((prev) => !prev);
              },
            },
            "<",
          )
          .fromTo(
            ".menu-item-number, .menu-item-icon",
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              stagger: {
                amount: 0.3,
              },
              duration: 0.1,
            },
            "<+=0.7",
          )
          .fromTo(
            mobileMenuBottomLink,
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              duration: 1,
            },
            "<",
          );

        menuCloseTlRef.current?.clear();
        menuOpenTlRef.current.restart();
      }

      if (!isMobileMenuOpen) {
        if (menuOpenTlRef.current?.isActive()) {
          menuOpenTlRef.current?.pause();
        }

        if (!menuCloseTlRef.current)
          menuCloseTlRef.current = gsap.timeline({ paused: true });

        menuCloseTlRef.current
          .set(
            "#mobile-menu-icon",
            {
              fill: "black",
            },
            0,
          )
          .to(
            ".menu-item-number, .menu-item-icon",
            {
              autoAlpha: 0,
              stagger: {
                amount: 0.3,
              },
              duration: 0.3,
            },
            0,
          )
          .to(
            mobileMenuBottomLink,
            {
              autoAlpha: 0,
            },
            "<",
          )
          .to(
            ".menu-item-label",
            {
              transform:
                "perspective(1000px) translate3d(20vw, 5vh, -40px) rotateY(50deg) rotateX(-20deg)",
              stagger: {
                amount: 0.4,
              },
              ease: "power2.in",
              duration: 0.4,
            },
            "<+=0.1",
          )
          .set(
            mobileMenu,
            {
              display: "none",
              autoAlpha: 0,
            },
            "<+=0.4",
          )
          .set(
            "#mobile-menu-icon",
            {
              fill: secondaryColor,
            },
            "<",
          )
          .set(
            "#navbar-background",
            {
              display: "block",
            },
            "<",
          )
          .set(
            "#navbar-logo-svg",
            {
              fill: secondaryColor,
            },
            "<",
          )
          .set(
            ".navbar-link",
            {
              color: foregroundColor,
            },
            "<",
          )
          .set(
            ".audio-indicator-line",
            {
              backgroundColor: foregroundColor,
            },
            "<",
          )
          .set(
            "#navbar-products-button",
            {
              color: "black",
              backgroundColor: secondaryColor,
            },
            "<",
          );

        menuOpenTlRef.current?.clear();
        menuCloseTlRef.current.restart();
      }
    },
    { dependencies: [isMobileMenuOpen] },
  );

  return (
    <div
      ref={mobileMenuRef}
      className="invisible fixed inset-0 z-40 hidden size-full flex-col justify-between bg-accent px-4 pb-6 pt-[clamp(6rem,16.5vw,8rem)] opacity-0 sm:px-6"
    >
      <ul className="space-y-[clamp(0.5rem,4vw,2rem)]">
        {mobileMenuItems.map((item, index) => {
          return (
            <li key={index} className="special-font menu-item flex font-zentry">
              <span
                id={`menu-item-number-${index + 1}`}
                ref={
                  index + 1 === mobileMenuItems.length
                    ? lastMenuItemNumberRef
                    : null
                }
                className={cn(
                  "menu-item-number self-start pr-8 text-body-mobile font-bold",
                  roboto_mono.className,
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Link href="" onClick={() => defaultLinkToast()}>
                <span
                  className="menu-item-label inline-flex self-end text-[clamp(3.5rem,-0.6756rem+22.2698vw,10rem)]/[0.8] font-black uppercase text-black"
                  style={{
                    transformOrigin: "50% 50% -100px",
                    willChange: "transform, opacity",
                  }}
                  dangerouslySetInnerHTML={{ __html: item.label }}
                />
              </Link>
              {item.icon && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="black"
                  className="menu-item-icon mb-2 ml-[clamp(0.25rem,1vw,0.5rem)] size-[clamp(0.5rem,4vw,2rem)] self-end"
                >
                  <use href="/icons/external-arrow-icon.svg#external-arrow-icon"></use>
                </svg>
              )}
            </li>
          );
        })}
      </ul>
      <div
        ref={mobileMenuBottomRef}
        className="flex items-center justify-between"
      >
        <ul>
          <li className="whitespace-nowrap font-circular-web text-[clamp(1rem,0.197rem+4.2827vw,2.25rem)] font-medium tracking-tighter">
            <Link
              href=""
              ref={mobileMenuBottomLinkRef}
              onClick={() => defaultLinkToast()}
            >
              Media Kit
            </Link>
          </li>
        </ul>
        <AudioButton isMobileMenuButton />
        {/* <button
          // onClick={toggleAudio}
          className="flex items-center gap-0.5 px-4 py-2 font-general font-bold uppercase"
        >
          <span className="sr-only">Toggle sound</span>
          <span className="mr-2 whitespace-nowrap text-[clamp(0.75rem,0.2682rem+2.5696vw,1.5rem)]">
            sound off
          </span>
          <audio
            // ref={audioRef}
            src="/audio/loop.mp3"
            loop
            className="hidden"
          />
          {Array.from(Array(5)).map((_, index) => (
            <div
              key={index}
              className={cn(
                "audio-indicator-line h-1 w-px rounded-full bg-black transition-all duration-200 ease-in-out",
                // {
                //   active: isAudioPlaying,
                // },
              )}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            />
          ))}
        </button> */}
      </div>
    </div>
  );
}
