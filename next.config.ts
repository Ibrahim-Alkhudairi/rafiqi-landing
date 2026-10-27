import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // app/global-not-found.tsx: the root layout is app/[lang], so an unknown
  // URL (/fr, /en/foo) has no layout to render a 404 inside.
  experimental: { globalNotFound: true },
  async redirects() {
    return [{ source: "/", destination: "/ar", permanent: false }];
  },
};

export default nextConfig;
