import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@/components/ui/button',
            '@/components/ui/card',
            '@/components/ui/dialog',
            '@/components/ui/input',
            '@/components/ui/select',
            '@/components/ui/tabs',
          ],
          'dictionary': [
            '@/components/dictionary/SearchBar',
            '@/components/dictionary/WordResult',
            '@/components/dictionary/DefinitionCard',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
