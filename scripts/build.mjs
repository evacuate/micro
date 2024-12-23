import { build } from "esbuild";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const options = {
  entryPoints: [path.resolve(__dirname, "../src/index.ts")],
  outfile: path.resolve(__dirname, "../dist/index.cjs"),
  platform: "node",
  format: "cjs",
  bundle: true,
  minify: true,
};

build(options).catch((err) => {
  console.error(err);
  process.exit(1);
});
