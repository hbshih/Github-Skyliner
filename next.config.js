/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    esmExternals: 'loose'
  },
  // Ensure CSS modules are properly handled
  webpack: (config) => {
    // Force CSS modules to be processed properly
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));

    // Update CSS loaders if needed
    return config;
  },
};

module.exports = nextConfig;
