"use client";

import Image from "next/image";
import ProductCard from "./product-card";
import TiltOnHover from "../tilt-on-hover";
import TiltInOnViewportEnter from "../tilt-in-on-viewport-enter";

export default function Products() {
  return (
    <section className="min-h-screen bg-black">
      <div className="mx-auto max-w-screen-2xl space-y-32 overflow-hidden px-3 py-32 md:px-10">
        <div>
          <p className="font-circular-web text-lg/none text-blue-50">
            Explore the Zentry Universe
          </p>
          <p className="max-w-md font-circular-web text-lg/none text-blue-50/50">
            Immerse yourself in an IP-rich product universe where AI-driven
            gamification and hyper-personalization lead humans & AI into a
            global play economy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
          <ProductCard
            src="videos/feature-1.mp4"
            title={
              <>
                radia<b>n</b>t
              </>
            }
            description="The game of games transforming your in-game actions across Web2 & Web3 titles into a rewarding adventure."
            containerClassName="col-span-2 aspect-square md:aspect-[1300/600]"
          />

          <ProductCard
            src="videos/feature-2.mp4"
            title={
              <>
                zig<b>m</b>a
              </>
            }
            description="The NFT collection merging Zentry’s IP, AI, and gaming—pushing the boundaries of NFT innovation."
            containerClassName="order-4 col-span-2 row-span-2 ml-auto aspect-[258/330] w-4/5 md:order-2 md:col-span-1 md:aspect-auto md:w-full"
          />

          <ProductCard
            src="videos/feature-3.mp4"
            title={
              <>
                n<b>e</b>xus
              </>
            }
            description="The player portal uniting humans & AI to play, compete, earn and showcase—gamifying social & Web3 experiences."
            containerClassName="order-2 col-span-2 row-span-1 ml-auto aspect-square w-3/5 md:order-3 md:col-span-1 md:aspect-[630/400] md:w-full"
          />

          <ProductCard
            src="videos/feature-4.mp4"
            title={
              <>
                az<b>u</b>l
              </>
            }
            description="The agent of agents elevating agentic AI experience to be more fun and productive. "
            containerClassName="order-3 col-span-2 row-span-1 mr-auto aspect-[266/190] w-4/5 md:order-4 md:col-span-1 md:aspect-[630/400] md:w-full"
          />

          <TiltInOnViewportEnter containerClassName="order-5 col-span-2 aspect-square w-1/2 md:col-span-1 md:aspect-[630/400] md:w-full">
            <TiltOnHover className="flex size-full overflow-hidden rounded-lg bg-violet-300 p-5">
              <div className="flex-1">
                <h2 className="special-font font-zentry text-[clamp(1.875rem,1.0227rem+4.2614vw,3.75rem)]/[0.82]">
                  m<b>o</b>re
                  <br />
                  co<b>m</b>ing
                  <br />s<b>o</b>on.
                  <br />
                </h2>
              </div>
              <div className="relative -bottom-5 -right-5 mt-auto size-[15vw] max-h-24 max-w-24 shrink-0">
                <Image
                  src="/img/zentry-symbol-black.png"
                  alt="zentry logo"
                  fill
                />
              </div>
            </TiltOnHover>
          </TiltInOnViewportEnter>

          <ProductCard
            src="videos/feature-5.mp4"
            autoplay
            containerClassName="order-6 col-span-2 row-span-1 mr-auto hidden aspect-[630/400] w-4/5 border-none md:col-span-1 md:block md:w-full"
          />
        </div>
      </div>
    </section>
  );
}
