// ** main install function
import checkDependency from "../utils/checkDependency.js";
import preInstall from "./preInstall.js";
import mainInstall from "./mainInstall.js";
import postInstall from "./postInstall.js";
import closeInstall from "./closeInstall.js";
import { dag, packageStore } from "../context.js";
import DAG from "../directed-graphs/dag.js";
import fs from "fs-extra";
import resetNodeModules from "../utils/resetNodeModules.js";

//? Steps for installing a package

//* 1. Check if package is already installed
// If not, proceed with installation
//

//* 2. Get package details from packageStore
//

//* 3. Run preInstall hook
// 3.1 Create node_modules folder if it doesn't exist
// 3.2 Create folder in node_modules for package if it doesn't exist
//

//* 4. Run mainInstall hook
// 4.1 Download tarball
// 4.2 Extract tarball
// 4.3 Delete tarball
//

//* 5. Run postInstall hook
// 5.1 Get package dependencies
// 5.2 Recursively install dependencies of package using DFS
//

//* 6. Close installation
// 6.1 Add package to package.json
// 6.2 Add package to joks-lock file
// 6.3 Print success message
//

/**
 * Installation function
 */
const installPackage = async (pNode) => {
  try {
    // checking if package is already installed
    const installed = checkDependency(pNode);
    if (installed) {
      return
    }

    // downloading package details from npm registry
    const packageJson = packageStore.get(pNode.name)

    // preInstall hook
    preInstall(pNode);

    // mainInstall hook
    await mainInstall(pNode, packageJson);

    // postInstall hook
    await postInstall(pNode, packageJson);
  } catch (error) {
    console.error(`Error installing ${pNode.name}: ${error}`);
  }
};


/**
 * Install function
 */
const install = async () => {
  console.log("Installing packages...");
  setup();
  const rootNodes = dag.getRootNodes();
  await Promise.all(rootNodes.map((node) => installPackage(node)));
  cleanup();
}

/**
 * Setup function
 */
const setup = () => {
  resetNodeModules();
}

/**
 * Cleanup function
 */
const cleanup = () => {
  closeInstall();
}

export default install;
export { installPackage };
