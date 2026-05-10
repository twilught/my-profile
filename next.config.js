/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "oxhajdlvumekiphwcczf.supabase.co" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/p/:slug",
        destination: "/projects/:slug",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
