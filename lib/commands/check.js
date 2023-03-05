// check if a package is installed in node_modules folder

import fs from "fs";
import path from "path";

const check = (dependency) => {
  try {
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);

    if (fs.existsSync(dependencyPath)) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(`Error checking ${dependency}: ${error}`);
  }
};

export default check;
