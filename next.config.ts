import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn.prod.website-files.com", // Add your image host here
      "example.com",
      "via.placeholder.com",
      "images.blush.design",
      "www.advancia-teleservices.com",
      "svgrepo.com",
      "images.unsplash.com",
      "www.hotesse-interim.fr",
      // You can add more domains if needed
    ],
  },
  // Other Next.js configurations can go here
};

export default nextConfig;
