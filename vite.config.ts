
import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  root: './dev',
  publicDir: '../public',
  build: {
    outDir: path.join(__dirname, 'dist'),
  },
  plugins: [reactRefresh()]
})
