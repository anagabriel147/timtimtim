/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Evita que os barrels de feature puxem a árvore inteira para o bundle da rota.
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  images: {
    // TODO: remover quando as imagens saírem de /public para um CDN/loader.
    unoptimized: true,
  },
}

export default nextConfig
