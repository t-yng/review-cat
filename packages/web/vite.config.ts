import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '' : '/',
  // @see: https://github.com/apollographql/apollo-client/issues/8661
  define: {
    __DEV__: false,
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
  },
  plugins: [reactRefresh(), vanillaExtractPlugin()],
}));
