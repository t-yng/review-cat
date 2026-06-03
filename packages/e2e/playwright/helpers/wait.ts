import { type Page } from 'playwright';

/**
 * ページ内の全ての画像が描画されるのを待つ
 * @param page
 * @returns
 */
export const waitForRenderedImages = async (page: Page) => {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every((img) => img.complete && img.naturalHeight > 0);
  });
};
