// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${process.env.NEXT_PUBLIC_CONVEX_URL}/:path*`,
//       },
//     ];
//   },
// };


// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 Ignore ESLint warnings on build
  },
  typescript: {
    ignoreBuildErrors: true, // 🚀 Ignore TS errors on build
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_CONVEX_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

