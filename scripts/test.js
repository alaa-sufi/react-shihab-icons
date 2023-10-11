const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");
const fetchIcon = require("./fetchIcon");

const rootDir = path.resolve();
const IconsDir = path.join(rootDir, "icons");
const lineDir = path.join(IconsDir, "Line");
const twoToneDir = path.join(IconsDir, "TowTone");

function copyPaths(fileName, category) {
  console.log("fileName: ", fileName);
  // Read the "line" SVG file
  const categoryLineDir = path.join(lineDir, category);
  //   console.log("categoryLineDir: ", categoryLineDir);
  const categoryTwoToneDir = path.join(twoToneDir, category);
  //   console.log("categoryTwoToneDir: ", categoryTwoToneDir);

  const lineFileContents = fs.readFileSync(
    path.join(categoryLineDir, fileName),
    "utf8"
  );

  //   Parse the "line" SVG file
  xml2js.parseString(lineFileContents, (err, lineResult) => {
    if (err) {
      console.error("Error parsing line SVG file:", fileName);
      return;
    }

    // Get the path elements from the "line" SVG file
    const linePaths = lineResult.svg.path;

    // Read the "towtone" SVG file
    const towtoneFileContents = fs.readFileSync(
      path.join(categoryTwoToneDir, fileName),
      "utf8"
    );

    // Parse the "towtone" SVG file
      xml2js.parseString(towtoneFileContents, (err, towtoneResult) => {
        if (err) {
          console.error("Error parsing towtone SVG file:", err);
          return;
        }

        // Get the path elements from the "towtone" SVG file
        const towtonePaths = towtoneResult.svg.path;

        // Check if the number of paths in both files match
        if (linePaths.length !== towtonePaths.length) {
          console.error(
            fileName
          );
          return;
        }

        // Copy the 'd' attribute from the "line" paths to the "towtone" paths while preserving opacity
        for (let i = 0; i < linePaths.length; i++) {
          towtonePaths[i].$.d = linePaths[i].$.d;
        }

        // Convert the modified XML back to SVG string
        const builder = new xml2js.Builder();
        const modifiedTowtoneXml = builder.buildObject(towtoneResult);

        // Write the modified "towtone" SVG file
        fs.writeFileSync(
          path.join(categoryTwoToneDir, fileName),
          modifiedTowtoneXml
        );

        // console.log("Paths copied successfully with opacity preserved.");
        // console.log(`Modified "towtone" SVG file saved as ${fileName}`);
      });
  });
}

const main = async () => {
  const icons = await fetchIcon(IconsDir);
  icons.categories.forEach((cat, j) => {
    cat.icons.forEach((i) => {
      //   console.log(i);
          copyPaths(i, cat.name);
    });
  });
};
// Usage:
main();
