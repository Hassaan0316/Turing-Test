/** @type {import('next').NextConfig} */

const withImages = require('next-images');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    disableStaticImages: false,
  },
};

module.exports = (_phase, {defaultConfig}) => {
  const plugins = [withImages];
  return plugins.reduce((acc, plugin) => plugin(acc), {...nextConfig});
};

// module.exports = nextConfig;
