import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Intro from "@/components/intro";
import Products from "@/components/products/products";
import Narrative from "@/components/narrative";
import { Toast } from "@/components/ui/toast";
import MobileMenu from "@/components/mobile-menu";
// import Preloader from "@/components/preloader";
import MeasurementElement from "@/components/measurement-element";

export default async function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="relative w-full overflow-x-hidden">
        <Hero />
        <Intro />
        <Products />
        <Narrative />
      </main>
      <Toast />
      <MobileMenu />
      {/* <Preloader /> */}
      <MeasurementElement />
    </>
  );
}
