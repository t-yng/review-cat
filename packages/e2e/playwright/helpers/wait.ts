import { type Page } from 'playwright';

/**
 * Wait for all images on the page to be rendered
 * @param page
 * @returns
 */
export const waitForRenderedImages = async (page: Page) => {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every((img) => img.complete && img.naturalHeight > 0);
  });
};
