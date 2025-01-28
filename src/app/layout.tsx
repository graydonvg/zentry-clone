import type { Metadata } from "next";
import "./globals.css";
import MeasurementElement from "@/components/measurement-element";
import Preloader from "@/components/preloader";

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
      <body className="overflow-hidden antialiased" suppressHydrationWarning>
        {children}
        <Preloader />
        <MeasurementElement />
      </body>
    </html>
  );
}
