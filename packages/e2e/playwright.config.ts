import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  reporter: 'html',
  expect: {
    toHaveScreenshot: {
      scale: 'device',
    },
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm --filter web dev & pnpm --filter main build:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
