/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
      buildActivity: false,
      autoPrerender: false, // disables prerender overlay
    },
    images: {
        domains: ["lh3.googleusercontent.com"], // add Google image domain
      },
  };
  
  export default nextConfig;
  