/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone trace output — o Dockerfile de produção copia só isso, sem node_modules inteiro.
  output: 'standalone',
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
