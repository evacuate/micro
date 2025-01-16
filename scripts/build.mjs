import { build } from 'esbuild';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

build({
  entryPoints: [resolve(dir, '../src/index.ts')],
  outfile: resolve(dir, '../dist/index.cjs'),
  platform: 'node',
  format: 'cjs',
  bundle: true,
  minify: true,
}).catch(() => process.exit(1));
