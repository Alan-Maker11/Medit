import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      { source: "/servicios", destination: "/punta-cana-tours", permanent: true },
      { source: "/reservar", destination: "/contact", permanent: true },
      { source: "/destinos", destination: "/punta-cana-tours", permanent: true },
      { source: "/tours", destination: "/punta-cana-tours", permanent: true },
    ];
  },
};

export default nextConfig;
