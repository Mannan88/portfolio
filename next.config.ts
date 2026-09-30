import type { NextConfig } from "next";

// Replace 'Mannan88' with your actual username and 'repository-name' with your actual repo name if different
const isProd = process.env.NODE_ENV === 'production';
// Make sure this exactly matches your repository name on GitHub
const repoName = "portfolio";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  // Only apply the prefix in production so local development still works
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
};

export default nextConfig;
