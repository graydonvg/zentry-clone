import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import MeasurementElement from "@/components/measurement-element";

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
        <MeasurementElement />
      </body>
    </html>
  );
}
