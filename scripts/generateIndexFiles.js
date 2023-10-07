const path = require("path");
const fs = require("fs");
const metaTags = require("../meta-data.json");

const { readdirSync } = fs;
const input = metaTags.categories
  .map((item) => [...item.icons])
  .join(",")
  .split(",")
  .map((item) => `src/${item}.js`);

const generateIndexFiles = async () => {
  const rootDir = path.resolve();

  const distDir = path.join(rootDir, "dist");
  const cjsDir = path.join(distDir, "cjs");
  const esmDir = path.join(distDir, "esm");
  const rollupPluginBabelHelpersCjsName = readdirSync(cjsDir).find((item) =>
    item.startsWith("_rollupPluginBabelHelpers")
  );
  const rollupPluginBabelHelpersEsmName = readdirSync(esmDir).find((item) =>
    item.startsWith("_rollupPluginBabelHelpers")
  );
  const cjsIndexContent = `${input
    .map(
      (file) =>
        `var ${file
          .replace(/^src\//, "")
          .replace(/\.js$/, "")} = require('./${file.replace(/^src\//, "")}');`
    )
    .join("\n")}
import './${rollupPluginBabelHelpersCjsName}';
require('react');
require('prop-types');
${input
      .map(
        (file) =>
          `exports.${file.replace(/^src\//, "").replace(/\.js$/, "")} = ${file
            .replace(/^src\//, "")
            .replace(/\.js$/, "")};`
      )
      .join("\n")}`;
  const esmIndexContent = `${input
    .map(
      (file) =>
        `export { default as ${file
          .replace(/^src\//, "")
          .replace(/\.js$/, "")} } from "./${file.replace(/^src\//, "")}";`
    )
    .join("\n")}
import './${rollupPluginBabelHelpersEsmName}';
require('react');
require('prop-types');`;

  fs.writeFile(
    path.join("dist", "cjs", "index.js"),
    cjsIndexContent,
    {
      encoding: "utf8",
      flag: "w",
      mode: 0o666,
    },
    (err) => {
      if (err) console.log(err);
    }
  );
  fs.writeFile(
    path.join("dist", "esm", "index.js"),
    esmIndexContent,
    {
      encoding: "utf8",
      flag: "w",
      mode: 0o666,
    },
    (err) => {
      if (err) console.log(err);
    }
  );
};

module.exports = generateIndexFiles;
