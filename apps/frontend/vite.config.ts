/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import type { UserConfig, Plugin } from 'vite';
import path from 'path';

// Type assertion for plugins to avoid TypeScript errors
const plugins: Plugin[] = [
  react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  }), 
  nxViteTsPaths(), 
  nxCopyAssetsPlugin(['*.md'])
] as unknown as Plugin[];

const config: UserConfig = {
  root: __dirname,
  base: '/', // Set base path for production
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://haultrackr-fullstack.onrender.com/api')
  },
  cacheDir: '../../node_modules/.vite/apps/frontend',
  optimizeDeps: {
    include: ['lucide-react'],
    force: true
  },
  server: {
    port: 4200,
    host: 'localhost',
    strictPort: true,
    open: true,
  },
  preview: {
    port: 4200,
    host: 'localhost',
    strictPort: true,
  },
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'leaflet', 'lucide-react'],
        },
      },
      external: []
    },
  },
};

export default defineConfig(config);
