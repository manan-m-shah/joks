// 3. Run preInstall hook
// 3.1 Create node_modules folder if it doesn't exist
// 3.2 Create folder in node_modules for package if it doesn't exist
//

import fs from "fs";
import getPaths from "../getPaths.js";

const preInstall = async (dependency) => {
  try {
    const { nodeModulesPath, dependencyPath } = getPaths(dependency);

    // create node_modules folder if it doesn't exist
    if (!fs.existsSync(nodeModulesPath)) {
      fs.mkdirSync(nodeModulesPath);
    }

    // create package folder if it doesn't exist
    if (!fs.existsSync(dependencyPath)) {
      fs.mkdirSync(dependencyPath);
    }

    return true;
  } catch (error) {
    // catch file system error
    throw new Error(`Failed pre installation: ${error.message}`);
  }
};

export default preInstall;
