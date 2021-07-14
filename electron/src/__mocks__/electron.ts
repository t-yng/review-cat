const browserWindowMock = {
  loadURL: jest.fn(),
  show: jest.fn(),
  webContents: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    on: () => {},
    session: {
      clearStorageData: jest.fn(),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  on: () => {},
  close: jest.fn(),
  hide: jest.fn(),
  destroy: jest.fn(),
};

export const BrowserWindow = jest.fn().mockImplementation(() => {
  return browserWindowMock;
});
