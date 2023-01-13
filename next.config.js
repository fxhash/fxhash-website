const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

if (!process.env.NEXT_PUBLIC_IPFS_GATEWAY || !process.env.NEXT_PUBLIC_IPFS_GATEWAY_SAFE) {
  console.log('url env variables NEXT_PUBLIC_IPFS_GATEWAY or NEXT_PUBLIC_IPFS_GATEWAY_SAFE are missing')
  return;
}
const urlGateway = new URL(process.env.NEXT_PUBLIC_IPFS_GATEWAY);
const urlGatewaySafe = new URL(process.env.NEXT_PUBLIC_IPFS_GATEWAY_SAFE);

// the main common security headers
const baseSecurityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  },
  // Isolates the browsing context exclusively to same-origin documents. 
  // Cross-origin documents are not loaded in the same browsing context.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
]

const winterUrl = process.env.NODE_ENV === "development" ? "https://sandbox-winter-checkout.onrender.com/" : "https://checkout.usewinter.com/"
const articlesAllowedDomains = `https://*.spotify.com/ https://spotify.com https://*.youtube.com/ https://youtube.com https://*.twitter.com/ https://twitter.com ${winterUrl}`


/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,

  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, /*1920, 2048, 3840*/],
    domains: [urlGateway.hostname, urlGatewaySafe.hostname]
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self'; frame-src ${process.env.NEXT_PUBLIC_IPFS_GATEWAY_SAFE} ${articlesAllowedDomains} 'self';`
          },
          ...baseSecurityHeaders,
        ]
      },
      {
        source: "/sandbox/worker.js",
        headers: [
          {
            key: "service-worker-allowed",
            value: "/"
          }
        ]
      },
      {
        source: "/sandbox/preview.html",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ""
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp"
          },
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
      { source: "/u/:name/activity", destination: "/u/:name/dashboard/activity", permanent: true },
      { source: "/pkh/:name/activity", destination: "/pkh/:name/dashboard/activity", permanent: true },
      { source: "/u/:name/creations", destination: "/u/:name", permanent: true },
      { source: "/pkh/:name/creations", destination: "/pkh/:name", permanent: true },

      process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1"
        ? { source: "/((?!maintenance|_next).*)", destination: "/maintenance", permanent: false }
        : { source: "/maintenance", destination: "/", permanent: false }
    ]
  }
})
