const browserWindowMock = {
  loadURL: jest.fn(),
  show: jest.fn(),
  webContents: {
    on: () => {},
    session: {
      clearStorageData: jest.fn(),
    },
  },
  on: () => {},
  close: jest.fn(),
  hide: jest.fn(),
  destroy: jest.fn(),
};

export const BrowserWindow = jest.fn().mockImplementation(() => {
  return browserWindowMock;
});
