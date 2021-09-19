module.exports = {
  plugins: [
    [
      'transform-inline-environment-variables',
      { include: ['GITHUB_APP_CLIENT_ID', 'GITHUB_APP_CLIENT_SECRET'] },
    ],
  ],
};
