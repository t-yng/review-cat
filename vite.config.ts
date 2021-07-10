import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  root: './renderer',
  base: process.env.NODE_ENV === 'production' ? '' : '/',
  build: {
    outDir: path.join(__dirname, 'dist'),
  },
  plugins: [reactRefresh()],
});
