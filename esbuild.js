require('esbuild').build({
  bundle: true,
  // NOTE: electronをバンドルすると実行パスチェックでエラーが発生するので、バンドルしない
  packages: 'external',
  entryPoints: ['electron/app.ts', 'electron/preload.ts'],
  outdir: 'dist',
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` ?? '"development"',
    'process.env.GITHUB_APP_CLIENT_ID': `"${process.env.GITHUB_APP_CLIENT_ID}"`,
    'process.env.GITHUB_APP_CLIENT_SECRET': `"${process.env.GITHUB_APP_CLIENT_ID}"`,
  },
  platform: 'node',
});
