import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const requestedBase = process.env.VITE_BASE_PATH ?? '/';
if (!/^\/(?:[A-Za-z0-9_.-]+\/)*$/.test(requestedBase)) {
  throw new Error('VITE_BASE_PATH deve ser / ou um caminho como /ultima-conexao/.');
}

export default defineConfig({
  base: requestedBase,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        id: requestedBase,
        name: 'Última Conexão',
        short_name: 'Última Conexão',
        description: 'Um telefone encontrado. Uma vida interrompida. Uma investigação ficcional.',
        lang: 'pt-BR',
        start_url: requestedBase,
        scope: requestedBase,
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#10292c',
        theme_color: '#10292c',
        categories: ['games', 'entertainment'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false,
      },
      devOptions: { enabled: false },
    }),
  ],
  build: { target: 'es2022', sourcemap: false },
});
