/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
});
