import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain HTML/JS files in out/, uploaded to Bluehost. The redirect from / to
  // /ar/ is in public/.htaccess: a static export has no server for redirects.
  output: "export",
  // /ar/ is written as ar/index.html, which Apache serves as is.
  trailingSlash: true,
  // No image server in an export; the images are already sized files.
  images: { unoptimized: true },
  // app/global-not-found.tsx: the root layout is app/[lang], so an unknown
  // URL (/fr, /en/foo) has no layout to render a 404 inside.
  experimental: { globalNotFound: true },
};

export default nextConfig;
