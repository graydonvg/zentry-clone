import type { Metadata } from "next";
import "./globals.css";

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
      <body className="overflow-hidden antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
