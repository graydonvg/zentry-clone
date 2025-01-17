import Intro from "@/components/intro";
import Products from "@/components/products/products";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { list } from "@vercel/blob";
import Narrative from "@/components/narrative";

export default async function Home() {
  const { blobs } = await list();

  const audioBlob = blobs.filter(
    (blob) => blob.pathname.includes("audio/") && blob.size > 0,
  );
  const heroVideosBlob = blobs.filter(
    (blob) => blob.pathname.includes("videos/hero") && blob.size > 0,
  );
  const productVideosBlob = blobs.filter(
    (blob) => blob.pathname.includes("videos/products") && blob.size > 0,
  );

  return (
    <>
      <header>
        <Navbar audioBlob={audioBlob} />
      </header>
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <Hero heroVideosBlob={heroVideosBlob} />
        <Intro />
        <Products productVideosBlob={productVideosBlob} />
        <Narrative />
      </main>
    </>
  );
}
