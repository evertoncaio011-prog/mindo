/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PWA: cabeçalhos para o service worker e o manifest funcionarem corretamente.
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
  ],
};

module.exports = nextConfig;
