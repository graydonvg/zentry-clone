import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltOnHover from "../animation/tilt-on-hover";
import TiltInOutOnScroll from "../animation/tilt-in-out-on-scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type Props = {
  src: string;
  title?: ReactNode;
  description?: string;
  autoplay?: boolean;
  containerClassName?: string;
};

export default function ProductCard({
  src,
  title,
  description,
  autoplay = false,
  containerClassName,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleMouseEnter() {
    const video = videoRef.current;

    if (!video || autoplay) return;

    video.play();
  }

  function handleMouseLeave() {
    const video = videoRef.current;

    if (!video || autoplay) return;

    video.pause();
    video.currentTime = 0;
  }

  return (
    <TiltInOutOnScroll containerClassName={containerClassName}>
      <TiltOnHover
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="border-border relative size-full overflow-hidden rounded-lg"
      >
        <video
          src={src}
          ref={videoRef}
          autoPlay={autoplay}
          loop
          muted
          playsInline
          className="absolute left-0 top-0 size-full object-cover object-center"
        />

        <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
          <div>
            <h2 className="special-font font-zentry text-[clamp(1.875rem,1.0227rem+4.2614vw,3.75rem)]/[0.82] font-black uppercase">
              {title}
            </h2>
            {description && (
              <p className="mt-3 max-w-56 text-xs md:text-base/none">
                {description}
              </p>
            )}
          </div>
        </div>
      </TiltOnHover>
    </TiltInOutOnScroll>
  );
}
