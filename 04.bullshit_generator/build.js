import { build } from "esbuild";
const buildOptions = {
  entryPoints: ["./browser/index.js"],
  outfile: "./dist/index.js",
  bundle: true,
  minify: true,
  globalName: "bullshitGenerator",
};
build(buildOptions);
