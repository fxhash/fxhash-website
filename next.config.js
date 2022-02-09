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
      { source: "/objkt/:params*", destination: "/gentk/:params*", permanent: true },
      // redirects because of the change in the doc structure
      { source: "/articles/about-fxhash", destination: "/doc/fxhash/overview", permanent: true },
      { source: "/articles/beta", destination: "/doc/fxhash/beta", permanent: true },
      { source: "/articles/changelog", destination: "/doc/fxhash/changelog", permanent: true },
      { source: "/articles/code-of-conduct", destination: "/doc/artist/code-of-conduct", permanent: true },
      { source: "/articles/collect-mint-tokens", destination: "/doc/collect/guide", permanent: true },
      { source: "/articles/getting-verified", destination: "/doc/fxhash/verification", permanent: true },
      { source: "/articles/guide-mint-generative-token", destination: "/doc/artist/guide-publish-generative-token", permanent: true },
      { source: "/articles/integration-guide", destination: "/doc/fxhash/integration-guide", permanent: true },
      { source: "/articles/moderation-system", destination: "/doc/fxhash/moderation", permanent: true },

      process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1"
        ? { source: "/((?!maintenance|_next).*)", destination: "/maintenance", permanent: false }
        : { source: "/maintenance", destination: "/", permanent: false }
    ]
  }
})
