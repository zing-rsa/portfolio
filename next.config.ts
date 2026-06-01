import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Slim, self-contained server bundle for the Kubernetes runtime image.
  output: "standalone",
  images: {
    // Personal-project screenshots and GitHub avatars are remote.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
