declare global {
  interface Window {
    ipc: {
      loginWithGithub: () => Promise<string>;
      getAccessToken: (code: string) => Promise<string>;
    };
  }
}

export {};
