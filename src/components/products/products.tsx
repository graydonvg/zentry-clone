"use client";

import ProductCard from "./product-card";
import TiltOnHover from "../animation/tilt-on-hover";
import TiltInOutOnScroll from "../animation/tilt-in-out-on-scroll";
import { ListBlobResultBlob } from "@vercel/blob";

function getProductVideos(productVideosBlob: ListBlobResultBlob[]) {
  const videoMap = new Map(
    productVideosBlob.map((video) => [
      video.pathname.split("/").at(-1),
      video.url,
    ]),
  );

  const productVideos = [
    {
      src: videoMap.get("product-1.mp4"),
    },
    {
      src: videoMap.get("product-2.mp4"),
    },
    {
      src: videoMap.get("product-3.mp4"),
    },
    {
      src: videoMap.get("product-4.mp4"),
    },
    {
      src: videoMap.get("product-5.mp4"),
    },
  ];

  return productVideos;
}

type Props = {
  productVideosBlob: ListBlobResultBlob[];
};

export default function Products({ productVideosBlob }: Props) {
  const productVideos = getProductVideos(productVideosBlob);

  return (
    <section className="min-h-screen bg-black px-3 py-16 sm:px-8 sm:py-24 md:px-24 lg:py-32">
      <div className="mx-auto max-w-screen-2xl space-y-16 overflow-hidden sm:space-y-24 lg:space-y-32">
        <div className="md:text-body-lg text-body-sm font-circular-web leading-[1.2]">
          <p className="text-blue-50">Explore the Zentry Universe</p>
          <p className="text-blue-50/50">
            Immerse yourself in an IP-rich product universe where
            <br />
            AI-driven gamification and hyper-personalization lead
            <br />
            humans & AI into a global play economy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
          <ProductCard
            src={productVideos[0].src || ""}
            title={
              <>
                radia<b>n</b>t
              </>
            }
            description="The game of games transforming your in-game actions across Web2 & Web3 titles into a rewarding adventure."
            containerClassName="col-span-2 aspect-square md:aspect-[1300/600]"
          />

          <ProductCard
            src={productVideos[1].src || ""}
            title={
              <>
                zig<b>m</b>a
              </>
            }
            description="The NFT collection merging Zentry’s IP, AI, and gaming—pushing the boundaries of NFT innovation."
            containerClassName="order-4 col-span-2 row-span-2 ml-auto aspect-[258/330] w-4/5 md:order-2 md:col-span-1 md:aspect-auto md:w-full"
          />

          <ProductCard
            src={productVideos[2].src || ""}
            title={
              <>
                n<b>e</b>xus
              </>
            }
            description="The player portal uniting humans & AI to play, compete, earn and showcase—gamifying social & Web3 experiences."
            containerClassName="order-2 col-span-2 row-span-1 ml-auto aspect-square w-3/5 md:order-3 md:col-span-1 md:aspect-[630/400] md:w-full"
          />

          <ProductCard
            src={productVideos[3].src || ""}
            title={
              <>
                az<b>u</b>l
              </>
            }
            description="The agent of agents elevating agentic AI experience to be more fun and productive. "
            containerClassName="order-3 col-span-2 row-span-1 mr-auto aspect-[266/190] w-4/5 md:order-4 md:col-span-1 md:aspect-[630/400] md:w-full"
          />

          <TiltInOutOnScroll containerClassName="order-5 col-span-2 aspect-square w-1/2 md:col-span-1 md:aspect-[630/400] md:w-full">
            <TiltOnHover className="flex size-full overflow-hidden rounded-lg bg-violet-300 p-5">
              <div className="flex-1">
                <h3 className="special-font text-h3/[0.82] font-zentry">
                  m<b>o</b>re
                  <br />
                  co<b>m</b>ing
                  <br />s<b>o</b>on.
                  <br />
                </h3>
              </div>
              <div className="bottom-0 right-0 mt-auto">
                <svg
                  aria-hidden="true"
                  className="size-[10vw] md:size-[3.5vw]"
                  fill="black"
                >
                  <use href="/icons/arrows-icon.svg#arrows-icon"></use>
                </svg>
              </div>
            </TiltOnHover>
          </TiltInOutOnScroll>

          <ProductCard
            src={productVideos[4].src || ""}
            autoplay
            containerClassName="order-6 col-span-2 row-span-1 mr-auto hidden aspect-[630/400] w-4/5 border-none md:col-span-1 md:block md:w-full"
          />
        </div>
      </div>
    </section>
  );
}
