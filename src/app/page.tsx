import Intro from "@/components/intro";
import Products from "@/components/products/products";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <Hero />
        <Intro />
        <Products />
      </main>
    </>
  );
}
