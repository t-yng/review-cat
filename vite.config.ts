import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import relay from 'vite-plugin-relay';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Viteのdevサーバー実行時にrelay@11.0.2で global is not defined が発生するので、その対策
    // @see: https://github.com/vitejs/vite/discussions/3859
    global: 'window',
  },
  root: './renderer',
  base: process.env.NODE_ENV === 'production' ? '' : '/',
  build: {
    outDir: path.join(__dirname, 'dist'),
  },
  plugins: [reactRefresh(), vanillaExtractPlugin(), relay],
});
