/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained .next/standalone output for Docker.
  // The final Docker image only needs this folder — no node_modules required.
  output: "standalone",
};

export default nextConfig;

