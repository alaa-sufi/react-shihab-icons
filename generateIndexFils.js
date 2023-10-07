const path = require("path");
const fs = require("fs");
const metaTags = require("./meta-data.json");

const input = metaTags.categories
  .map((item) => [...item.icons])
  .join(",")
  .split(",")
  .map((item) => `src/${item}.js`);

const generateIndexFiles = async () => {
  const cjsIndexPath = path.resolve(__dirname, "dist/cjs/index.js");
  const esmIndexPath = path.resolve(__dirname, "dist/esm/index.js");

  const cjsIndexContent = `
    ${input
      .map(
        (file) =>
          `var ${file
            .replace(/^src\//, "")
            .replace(/\.js$/, "")} = require('./${file.replace(
            /^src\//,
            ""
          )}');`
      )
      .join("\n")}
    import './_rollupPluginBabelHelpers-3bc641ae.js';
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
  const esmIndexContent = `
    ${input
      .map(
        (file) =>
          `export { default as ${file
            .replace(/^src\//, "")
            .replace(/\.js$/, "")} } from "./${file.replace(/^src\//, "")}";`
      )
      .join("\n")}
      import './_rollupPluginBabelHelpers-3bc641ae.js';
      require('react');
      require('prop-types');
      `;

  fs.writeFileSync(cjsIndexPath, cjsIndexContent);
  fs.writeFileSync(esmIndexPath, esmIndexContent);
};

generateIndexFiles()