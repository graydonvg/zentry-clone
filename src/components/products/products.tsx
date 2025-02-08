import ProductCard from "./product-card";
import TiltOnHover from "../animation/tilt-on-hover";
import TiltInOutOnScroll from "../animation/tilt-in-out-on-scroll";

export default function Products() {
  return (
    <section className="min-h-screen bg-black px-3 py-16 sm:px-8 sm:py-24 md:px-24 lg:py-32">
      <div className="mx-auto max-w-screen-2xl space-y-16 sm:space-y-24 lg:space-y-32">
        <div className="font-circular-web text-body-mobile leading-[1.2] md:text-body-desktop">
          <p className="text-foreground">Explore the Zentry Universe</p>
          <p className="text-foreground/50">
            Immerse yourself in an IP-rich product universe where
            <br />
            AI-driven gamification and hyper-personalization lead
            <br />
            humans & AI into a global play economy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
          <ProductCard
            src="/videos/product-1.mp4"
            title={
              <>
                radia<b>n</b>t
              </>
            }
            description="The game of games transforming your in-game actions across Web2 & Web3 titles into a rewarding adventure."
            containerClassName="col-span-2 aspect-square md:aspect-[1300/600]"
          />

          <ProductCard
            src="/videos/product-2.mp4"
            title={
              <>
                zig<b>m</b>a
              </>
            }
            description="The NFT collection merging Zentry’s IP, AI, and gaming—pushing the boundaries of NFT innovation."
            containerClassName="order-4 col-span-2 row-span-2 ml-auto aspect-[258/330] w-4/5 md:order-2 md:col-span-1 md:aspect-auto md:w-full"
          />

          <ProductCard
            src="/videos/product-3.mp4"
            title={
              <>
                n<b>e</b>xus
              </>
            }
            description="The player portal uniting humans & AI to play, compete, earn and showcase—gamifying social & Web3 experiences."
            containerClassName="order-2 col-span-2 row-span-1 ml-auto aspect-square w-3/5 md:order-3 md:col-span-1 md:aspect-[630/400] md:w-full"
          />

          <ProductCard
            src="/videos/product-4.mp4"
            title={
              <>
                az<b>u</b>l
              </>
            }
            description="The agent of agents elevating agentic AI experience to be more fun and productive. "
            containerClassName="order-3 col-span-2 row-span-1 mr-auto aspect-[266/190] w-4/5 md:order-4 md:col-span-1 md:aspect-[630/400] md:w-full"
          />

          <TiltInOutOnScroll containerClassName="order-5 col-span-2 aspect-square w-1/2 md:col-span-1 md:aspect-[630/400] md:w-full">
            <TiltOnHover className="flex size-full overflow-hidden rounded-lg bg-primary p-5 text-black">
              <div className="flex-1">
                <h3 className="special-font font-zentry text-h3/[0.82]">
                  m<b>o</b>re
                  <br />
                  co<b>m</b>ing
                  <br />s<b>o</b>on.
                  <br />
                </h3>
              </div>
              <div className="bottom-0 right-0 mt-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="size-[10vw] fill-black md:size-[3.5vw]"
                >
                  <use href="/icons/arrows-icon.svg#arrows-icon"></use>
                </svg>
              </div>
            </TiltOnHover>
          </TiltInOutOnScroll>

          <ProductCard
            src="/videos/product-5.mp4"
            autoplay
            containerClassName="order-6 col-span-2 row-span-1 mr-auto hidden aspect-[630/400] w-4/5 border-none md:col-span-1 md:block md:w-full"
          />
        </div>
      </div>
    </section>
  );
}
