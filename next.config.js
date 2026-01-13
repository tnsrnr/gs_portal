/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! 주의: 이 옵션은 타입 검사를 완전히 건너뛰므로 주의해서 사용해야 합니다
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/htns/:path*',
        destination: 'https://qa-lv1.htns.com/:path*', // /htns/ 제거됨
      },
    ];
  },
};

module.exports = nextConfig; 