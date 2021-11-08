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
  }
})
