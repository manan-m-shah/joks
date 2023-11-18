// check if a package is installed in node_modules folder

import fs from "fs";
import getNodeModulesPath from "./getPaths.js";

const checkDependency = (pNode) => {
  try {
    if (!pNode) {
      throw new Error("No dependency specified");
    }

    const dependencyPath = getNodeModulesPath() + pNode.path;
    if (fs.existsSync(dependencyPath)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Error checking ${dependency}: ${error}`);
  }
};

export default checkDependency;
