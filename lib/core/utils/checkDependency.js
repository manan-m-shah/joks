// check if a package is installed in node_modules folder

import fs from "fs";
import getPaths from "../getPaths.js";

const checkDependency = async (dependency) => {
  try {
    if (!dependency) {
      throw new Error("No dependency specified");
    }

    const { _, dependencyPath } = getPaths(dependency);

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
