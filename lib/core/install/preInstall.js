//* 3. Run preInstall hook
// 3.1 Create node_modules folder if it doesn't exist
// 3.2 Create folder in node_modules for package if it doesn't exist
//

import { ensureDirSync } from "fs-extra";
import getNodeModulesPath from "../utils/getPaths.js";

const preInstall = (pNode) => {
  try {
    const dependencyPath = getNodeModulesPath() + pNode.path;
    ensureDirSync(dependencyPath);
  } catch (error) {
    // catch file system error
    throw new Error(`Failed pre installation: ${error.message}`);
  }
};

export default preInstall;
