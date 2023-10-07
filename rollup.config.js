import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import external from "rollup-plugin-peer-deps-external";
import metaTags from "./meta-data.json";

// const input = metaTags.categories[0].icons.map(item => `src/${item}.js`);
const input = metaTags.categories
  .map((item) => [...item.icons])
  .join(",")
  .split(",")
  .map((item) => `src/${item}.js`);

const output = [
  {
    dir: "dist/cjs",
    format: "cjs",
    exports: "auto",
    sourcemap: false,
  },
  {
    dir: "dist/esm",
    format: "es",
    exports: "auto",
    sourcemap: false,
  },
];

const plugins = [
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
  external(),
  resolve(),
  commonjs(),
  copy({
    targets: [
      { src: "./src/index.d.ts", dest: "dist" },
      { src: "./meta-data.json", dest: "dist" },
    ],
  }),
];

export default {
  input,
  output,
  external: ["react", "prop-types"],
  plugins,
};