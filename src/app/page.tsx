import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Intro from "@/components/intro";
import Products from "@/components/products/products";
import Narrative from "@/components/narrative";

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
    </>
  );
}
