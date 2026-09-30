import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

// The security headers that Express set in a blanket middleware
// (server/app.js:402-413) have no App Router equivalent, because there is no
// single middleware wrapping every response. next.config headers() is the
// closest replacement and is the one place that reliably covers pages, route
// handlers and static files alike.
//
// Two blocks, not one. Uploaded files are user-supplied and are served from
// this same origin, so they additionally need the sandbox CSP that Express
// applied to /uploads only (server/app.js:418-426). Without it, a file that
// passes the extension allowlist is still interpreted as HTML by the browser.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  // The site renders every image with a plain <img> tag against a root-absolute
  // /assets/... path, so next/image is deliberately not enabled: turning it on
  // would require rewriting every image and would not apply to the
  // admin-uploaded files in /uploads anyway.
  poweredByHeader: false,
  reactStrictMode: true,

  // `next dev` and `next start` both honour $PORT, so the same variable that the
  // old Vite config read still works for both without any devServer block.

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/uploads/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'none'; sandbox",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
