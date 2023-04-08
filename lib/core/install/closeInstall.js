// 6. Close installation
// 6.1 Add package to package.json
// 6.2 Add package to joks-lock file
// 6.3 Print success message
//

import fs from "fs";
import path from "path";
import getMainPackageJson from "../utils/getMainPackageJson.js";

const closeInstall = (dependency, packageJson) => {
  try {
    // Adding package to package.json
    const mainPackageJson = getMainPackageJson();
    if (!mainPackageJson.dependencies) {
      mainPackageJson.dependencies = {};
    }
    mainPackageJson.dependencies[dependency] = packageJson["dist-tags"].latest;
    fs.writeFileSync(
      path.join(process.cwd(), "package.json"),
      JSON.stringify(mainPackageJson, null, 2)
    );
    // Printing success message
    console.log(`Successfully installed ${dependency}!`);
  } catch (error) {
    throw new Error(`Failed to close installation: ${error.message}`);
  }
};

export default closeInstall;
