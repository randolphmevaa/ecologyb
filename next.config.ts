import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn.prod.website-files.com",
      "example.com",
      "via.placeholder.com",
      "images.blush.design",
      "www.advancia-teleservices.com",
      "openweathermap.org",
      "svgrepo.com",
      "images.unsplash.com",
      "randomuser.me",
      "picsum.photos",
      "www.heat-me.be",
      "default-image-url.com",
      "www.hotesse-interim.fr",
    ],
  },
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
