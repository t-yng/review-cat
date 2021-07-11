const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipc', {
  loginWithGithub: async () => {
    const code = await ipcRenderer.invoke('loginWithGithub');
    return code;
  },
  getAccessToken: async (code) => {
    const token = await ipcRenderer.invoke('getAccessToken', code);
    return token;
  },
});
