import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Image uploads go through a server action. The 1MB default rejected anything over
      // 1MB although the uploader allows 4MB; 4.4MB leaves room for multipart overhead and
      // stays under Vercel's 4.5MB request body cap. Images are also compressed client-side.
      bodySizeLimit: "4.4mb",
    },
  },
};

export default nextConfig;
