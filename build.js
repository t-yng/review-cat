const path = require('path');
const { build } = require('electron-builder');

build({
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
