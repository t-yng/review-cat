const path = require('path');
const builder = require('electron-builder');

builder.build({
  targets: builder.Platform.MAC.createTarget(),
  publish: 'never',
  config: {
    directories: {
      output: path.join(__dirname, 'app'),
    },
    appId: 'com.higeOhige.ReviewCat',
    productName: 'ReviewCat',
    copyright: 'higeOhige',
    files: ['./dist'],
    mac: {
      icon: 'dist/assets/images/app-icon.png',
    },
  },
});
