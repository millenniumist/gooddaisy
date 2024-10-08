/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*',
          },
        ],
      },
      compiler: {
        // Suppress the warning
        reactRemoveProperties: { properties: ['^data-new-gr-c-s-check-loaded$', '^data-gr-ext-installed$'] }},
        eslint: {
          ignoreDuringBuilds: true,
        },
        typescript: {
          ignoreBuildErrors: true,
        },
      }
export default nextConfig;
