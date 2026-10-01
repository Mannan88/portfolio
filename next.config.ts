import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// Make sure this exactly matches your repository name on GitHub
const repoName = "portfolio";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
};

export default nextConfig;
