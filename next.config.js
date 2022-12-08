/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    path: '/',
    trailingSlash: true,
    // async redirects(){
    //   return [
    //     {
    //       source: '/',
    //       destination: '/'
    //     }
    //   ]
    // }
  },
};

module.exports = nextConfig;
