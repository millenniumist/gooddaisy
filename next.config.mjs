/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  compiler: {
    // Suppress the warning
    reactRemoveProperties: {
      properties: ["^data-new-gr-c-s-check-loaded$", "^data-gr-ext-installed$"],
    },
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  headers: async () => {
    return [
      {
        source: "/checkout",
        headers: [
          {
            key: "X-User-ID",
            value: "test",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
