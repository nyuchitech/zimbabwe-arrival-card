import type { NextConfig } from "next";

// Content Security Policy - adjust based on your needs
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://*.vercel.app https://api.resend.com;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  // DNS prefetch for performance
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Force HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // XSS protection (legacy browsers)
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  // Prevent cross-origin information leakage
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
];

// Cache control headers for different content types
const cacheHeaders = {
  // Static assets - long cache
  static: [
    {
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    },
  ],
  // API responses - no cache
  api: [
    {
      key: "Cache-Control",
      value: "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
    {
      key: "Pragma",
      value: "no-cache",
    },
    {
      key: "Expires",
      value: "0",
    },
  ],
  // HTML pages - short cache with revalidation
  html: [
    {
      key: "Cache-Control",
      value: "public, max-age=0, must-revalidate",
    },
  ],
};

const nextConfig: NextConfig = {
  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.moha.gov.zw",
        pathname: "/images/**",
      },
    ],
    // Optimize image security
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features
  experimental: {
    // Enable server actions with proper body size limits
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },

  // Headers configuration
  async headers() {
    return [
      // Apply security headers to all routes
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Cache static assets
      {
        source: "/static/:path*",
        headers: cacheHeaders.static,
      },
      {
        source: "/_next/static/:path*",
        headers: cacheHeaders.static,
      },
      // No cache for API routes
      {
        source: "/api/:path*",
        headers: cacheHeaders.api,
      },
      // Special headers for health endpoint
      {
        source: "/api/health",
        headers: [
          ...cacheHeaders.api,
          { key: "X-Health-Check", value: "true" },
        ],
      },
    ];
  },

  // Redirects for security
  async redirects() {
    return [
      // Redirect common attack vectors
      {
        source: "/wp-admin/:path*",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/wp-login.php",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/xmlrpc.php",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/.env",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/.git/:path*",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/config/:path*",
        destination: "/404",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
