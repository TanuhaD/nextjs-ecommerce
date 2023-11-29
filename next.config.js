/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "avatars.githubusercontent.com" },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/demchenko-ecommerce/**",
      },
    ],
  },
};

module.exports = nextConfig;
