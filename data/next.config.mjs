/** @type {import('next').NextConfig} */
const nextConfig = {
  // ให้ Next รู้ว่าเป็น app for Vercel
  output: 'standalone',

  // เปิดการ optimize ที่ปลอดภัย
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion'
    ],
    typedRoutes: true
  },

  // ภาพจาก Unsplash / อื่น ๆ
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // ใส่โดเมนอื่นถ้ามีรูปจากภายนอก
      // { protocol: 'https', hostname: 'your-cdn.example.com' }
    ],
    // เปิด strict mime type (แนะนำ)
    dangerouslyAllowSVG: false,
    // กรณีใช้ loader พิเศษปล่อยค่า default
  },

  // เปลี่ยนจาก images.domains (deprecated) เป็น remotePatterns ด้านบนแล้ว

  // Redirect ทางลัด /p/:slug → /projects/:slug
  async redirects() {
    return [
      {
        source: '/p/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
    ];
  },

  // Header cache แบบเบา ๆ สำหรับรูปใน /public/images
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ปิด ESLint ตอน build ถ้ายังจัดไม่เรียบร้อย (เลือกใช้ได้)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ปิด TypeScript build error ถ้า CI ยังมี warning (เลือกใช้ได้)
  typescript: {
    ignoreBuildErrors: false, // ตั้ง true ชั่วคราวได้ถ้าติดบล็อค
  },
};

export default nextConfig;
