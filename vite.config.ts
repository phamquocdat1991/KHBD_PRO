import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/docx') || id.includes('node_modules/jszip') || id.includes('node_modules/file-saver')) {
            return 'vendor-docx';
          }
          if (id.includes('node_modules/pptxgenjs')) {
            return 'vendor-pptx';
          }
          if (id.includes('node_modules/mammoth')) {
            return 'vendor-mammoth';
          }
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
  test: {
    testTimeout: 25000,
    hookTimeout: 25000,
  },
});
