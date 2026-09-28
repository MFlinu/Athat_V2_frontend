import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // أضف هذا السطر لتسكين أي تحذير مستقبلي حول Turbopack
  turbopack: {}, 
};

export default nextConfig;