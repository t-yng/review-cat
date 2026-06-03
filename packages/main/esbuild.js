const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

require('esbuild').build({
  bundle: true,
  // NOTE: Bundling electron causes an error in the execution path check, so it is not bundled
  packages: 'external',
  entryPoints: ['src/app.ts', 'src/preload.ts'],
  outdir: 'dist',
  define: {
    'process.env.NODE_ENV': process.env.NODE_ENV
      ? `"${process.env.NODE_ENV}"`
      : '"development"',
    'process.env.GITHUB_APP_CLIENT_ID': `"${process.env.GITHUB_APP_CLIENT_ID}"`,
    'process.env.GITHUB_APP_CLIENT_SECRET': `"${process.env.GITHUB_APP_CLIENT_SECRET}"`,
  },
  platform: 'node',
});
