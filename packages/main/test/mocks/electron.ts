import { vi } from 'vitest';

const browserWindowMock = {
  loadURL: vi.fn(),
  show: vi.fn(),
  webContents: {
    on: () => {},
    session: {
      clearStorageData: vi.fn(),
    },
  },
  on: () => {},
  close: vi.fn(),
  hide: vi.fn(),
  destroy: vi.fn(),
};

export const BrowserWindow = vi.fn().mockImplementation(() => {
  return browserWindowMock;
});
