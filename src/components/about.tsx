"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Image from "next/image";
import AnimatedTitle from "./animated-title";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function About() {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClassName="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>The Game of Games begins&mdash;your life, now and epic MMORPG</p>
          <p className="text-black/40">
            Zentry unites every player from countless games and platforms,
            <br /> both digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      <div id="clip" className="h-dvh w-screen">
        <div className="mask-clip-path about-image">
          <Image
            src="/img/about.webp"
            alt="background"
            fill
            sizes="100vw"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
