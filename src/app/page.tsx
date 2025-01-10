import About from "@/components/about";
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
        <About />
        <section className="min-h-screen w-full bg-black" />
      </main>
    </>
  );
}
