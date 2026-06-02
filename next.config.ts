import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "*.supabase.co",
      //   port: "",
      //   pathname: "/storage/v1/object/public/**",
      // },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
} satisfies NextConfig;

export default nextConfig;
