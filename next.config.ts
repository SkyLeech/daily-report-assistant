import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is disabled because its `setTimeout` usage is not yet
  // compatible with the Workers runtime used by @opennextjs/cloudflare.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/daily-report",
        permanent: false,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Makes D1 and other Cloudflare bindings available while running `next dev`.
initOpenNextCloudflareForDev();
