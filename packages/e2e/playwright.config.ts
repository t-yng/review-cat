import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
});
