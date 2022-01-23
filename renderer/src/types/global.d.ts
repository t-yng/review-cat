declare global {
  interface Window {
    ipc: {
      loginWithGithub: () => Promise<string>;
      getAccessToken: (code: string) => Promise<string>;
      updateAutoLaunch: (autoLaunched: boolean) => void;
    };
  }
}

export {};
