import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/audio/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/fonts/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/icons/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/img/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //       ],
  //     },
  //     {
  //       source: "/videos/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
