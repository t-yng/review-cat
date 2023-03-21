const { mergeConfig } = require('vite');
module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
    interactionsDebugger: true,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [require('@vanilla-extract/vite-plugin').vanillaExtractPlugin()],
    });
  },
  docs: {
    autodocs: true,
  },
};
