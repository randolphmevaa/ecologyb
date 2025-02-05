import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn.prod.website-files.com", // Add your image host here
      // You can add more domains if needed
    ],
  },
  // Other Next.js configurations can go here
};

export default nextConfig;
