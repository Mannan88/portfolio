import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Required for GitHub Pages static hosting
  output: "export",
  images: {
    unoptimized: true,
  },

  // IMPORTANT: If your repository is named "my-portfolio" and will be hosted at
  // username.github.io/my-portfolio, you must uncomment and update the line below:
  // basePath: "/my-portfolio",
};

export default nextConfig;
