/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" } // เพิ่มโดเมนรูปอื่น ๆ ได้
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
