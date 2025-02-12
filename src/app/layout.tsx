import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const general = localFont({
  src: "../../public/fonts/general.woff2",
  variable: "--general",
  display: "swap",
  fallback: ["sans-serif"],
});
const roobert = localFont({
  src: "../../public/fonts/roobert.woff2",
  variable: "--roobert",
  display: "swap",
  fallback: ["sans-serif"],
});
const roobertMedium = localFont({
  src: "../../public/fonts/roobert-medium.woff2",
  variable: "--roobert-medium",
  display: "swap",
  fallback: ["sans-serif"],
});
const zentry = localFont({
  src: "../../public/fonts/zentry.woff2",
  variable: "--zentry",
  display: "swap",
  fallback: ["sans-serif"],
});

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
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />
      </head>
      <body
        className={cn(
          "overflow-hidden overflow-x-hidden bg-secondary font-general antialiased",
          general.variable,
          roobert.variable,
          roobertMedium.variable,
          zentry.variable,
        )}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
