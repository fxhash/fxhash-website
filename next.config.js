const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/sandbox/worker.js",
        headers: [
          {
            key: "service-worker-allowed",
            value: "/"
          }
        ]
      }
    ]
  },

  redirects() {
    return [
      process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1"
        ? { source: "/((?!maintenance|_next).*)", destination: "/maintenance", permanent: false }
        : null,
    ].filter(Boolean);
  }
})
