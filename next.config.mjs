/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
      buildActivity: false,
      autoPrerender: false,
    },
    images: {
      domains: ["lh3.googleusercontent.com", "utfs.io"], // added utfs.io
    },
  };
  
  export default nextConfig;
  