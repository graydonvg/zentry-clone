import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Zentry clone",
  description: "A clone of zentry.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        <Suspense
          fallback={
            <div className="special-font fixed inset-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-violet-300 font-zentry text-[clamp(1rem,10vw+2rem,10rem)] uppercase text-white">
              <span>
                Lo<b>a</b>ding...
              </span>
            </div>
          }
        >
          {children}
        </Suspense>
        {/* measurement-element used to get the viewport height including mobile browser bars to prevent layout shift when bars hide/show */}
        <div
          id="measurement-element"
          className="pointer-events-auto invisible absolute inset-0 -z-50 h-screen w-full select-none"
        />
      </body>
    </html>
  );
}
