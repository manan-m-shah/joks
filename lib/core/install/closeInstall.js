// 6. Close installation
// 6.1 Add package to package.json
// 6.2 Add package to joks-lock file
//

import { getMainPackageJson, setMainPackageJson } from "../utils/mainPackageJson.js";
import { dag, packageStore } from "../context.js";

const closeInstall = () => {
  try {
    // Getting main package.json
    const mainPackageJson = getMainPackageJson();
    mainPackageJson.dependencies = {};

    // Adding root packages to package.json
    const roots = dag.getRootNodes();
    for (const root of roots) {
      mainPackageJson.dependencies[root.name] = root.version;
    }
    setMainPackageJson(mainPackageJson);
  } catch (error) {
    throw new Error(`Failed to close installation: ${error.message}`);
  }
};

export default closeInstall;
