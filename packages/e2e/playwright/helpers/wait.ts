import { type Page } from 'playwright';

/**
 * ページ内の全ての画像が読み込み完了するのを待つ
 * @param page
 * @returns
 */
export const waitForLoadedImages = async (page: Page) => {
  return await Promise.all(
    (
      await page.getByRole('img').all()
    ).map(async (img) => {
      const src = await img.getAttribute('src');
      if (src) {
        return page.waitForResponse(src);
      }
    })
  );
};
