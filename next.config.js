/** @type {import('next').NextConfig} */

// Vercel doesn't read .htaccess (that's Apache). These headers are the
// equivalent: cache TTLs for static files, security headers, and keeping
// API/private routes out of search indexes.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    // serve AVIF first, then WebP, for every next/image
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // fonts for the generated Open Graph images
  experimental: {
    outputFileTracingIncludes: {
      "/**/*": ["./assets/fonts/**/*", "./public/Tushar.jpg"],
    },
  },
  async redirects() {
    return [
      { source: "/ContactMe", destination: "/contact", permanent: true },
      { source: "/Work", destination: "/projects", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // images, icons and fonts in /public: 30 days, then revalidate in the background
        source: "/:file*\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/details",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

module.exports = nextConfig;
