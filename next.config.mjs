/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    outputFileTracingIncludes: {
      '/*': [
        './node_modules/computer-modern/fonts/cmu-serif-500-roman.ttf',
        './node_modules/computer-modern/fonts/cmu-serif-500-italic.ttf',
        './node_modules/computer-modern/fonts/cmu-serif-700-roman.ttf',
        './node_modules/computer-modern/fonts/cmu-serif-700-italic.ttf',
      ],
    },
  },
};

export default nextConfig;
