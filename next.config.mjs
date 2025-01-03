/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 7001],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'rbxzvgiukwypxhjvyixn.supabase.co',
          port: '',
          pathname: '/storage/v1/object/public/**',
        },
      ],
    },
  };
  
  export default nextConfig;