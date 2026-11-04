import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  ...(isStaticExport
    ? { output: "export", trailingSlash: true, basePath: basePath || undefined, images: { unoptimized: true } }
    : {
        async headers() {
          return [
            {
              source: "/assets/:path*",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ];
        },
      }),
};

export default nextConfig;
