import type { NextConfig } from 'next';

// 브라우저는 같은 출처의 /api로 요청하고, 실제 서버로는 여기서 넘깁니다. CORS를 피하고 서버 주소를 코드에 두지 않기 위해서입니다.
// API_ORIGIN은 서버 전용 환경변수이며 `.env.local`에 설정합니다. (예: https://example.com)
const apiOrigin = process.env.API_ORIGIN;

const nextConfig: NextConfig = {
  rewrites() {
    return [
      { source: '/', destination: '/places' },
      ...(apiOrigin ? [{ source: '/api/:path*', destination: `${apiOrigin}/api/:path*` }] : []),
    ];
  },
};

export default nextConfig;
