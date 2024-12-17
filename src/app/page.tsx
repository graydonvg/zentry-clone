import About from "@/components/about";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Hero />
      <About />
      <section className="min-h-screen w-screen bg-black" />
    </main>
  );
}
