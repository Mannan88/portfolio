// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "portfolio";
const basePath = isProd ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: isProd ? `${basePath}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
