import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const dir = dirname(fileURLToPath(import.meta.url));

build({
  entryPoints: [resolve(dir, '../src/index.ts')],
  outfile: resolve(dir, '../dist/index.cjs'),
  platform: 'node',
  format: 'cjs',
  bundle: true,
  minify: true,
}).catch(() => process.exit(1));
