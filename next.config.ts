import type { NextConfig } from "next";

function resolveBackendOrigin(): string {
  const fromBackendEnv = process.env.API_BACKEND_URL?.trim();
  if (fromBackendEnv) {
    return fromBackendEnv.replace(/\/+$/, "");
  }

  const fromPublicApi = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromPublicApi && /^https?:\/\//i.test(fromPublicApi)) {
    return fromPublicApi.replace(/\/api\/v1\/?$/i, "").replace(/\/+$/, "");
  }

  return "http://localhost:5000";
}

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  async rewrites() {
    const backendOrigin = resolveBackendOrigin();
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
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
