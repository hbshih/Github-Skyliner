/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force client-side rendering for pages with 3D components
  // This helps prevent hydration errors
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    // Add specific handling for problematic packages
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    // Prevent issues with specific packages
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

export default nextConfig;
