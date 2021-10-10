let isDev = false;
if (process.argv.includes("dev")) isDev = true;

const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./docs/src/index.ts"],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  outfile: "./docs/index.js",
  watch: isDev,
  target: "esnext",
  loader: {
    ".woff": "file",
    ".woff2": "file",
    ".ttf": "file",
  },
});
