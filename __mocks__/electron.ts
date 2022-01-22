import { vi } from 'vitest';

const browserWindowMock = {
  loadURL: vi.fn(),
  show: vi.fn(),
  webContents: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    on: () => {},
    session: {
      clearStorageData: vi.fn(),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  on: () => {},
  close: vi.fn(),
  hide: vi.fn(),
  destroy: vi.fn(),
};

export const BrowserWindow = vi.fn().mockImplementation(() => {
  return browserWindowMock;
});
