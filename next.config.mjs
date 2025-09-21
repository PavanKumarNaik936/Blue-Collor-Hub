/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
      buildActivity: false,
      autoPrerender: false, // disables prerender overlay
    },
  };
  
  export default nextConfig;
  