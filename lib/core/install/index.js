// ** main install function

import fetch, { FetchError } from "node-fetch";
import checkDependency from "../utils/checkDependency.js";
import preInstall from "./preInstall.js";
import mainInstall from "./mainInstall.js";
import postInstall from "./postInstall.js";
import closeInstall from "./closeInstall.js";

// * Steps for installing a package

// 1. Check if package is already installed
// If not, proceed with installation
//

// 2. Download package details from npm registry
//

// 3. Run preInstall hook
// 3.1 Create node_modules folder if it doesn't exist
// 3.2 Create folder in node_modules for package if it doesn't exist
//

// 4. Run mainInstall hook
// 4.1 Download tarball
// 4.2 Extract tarball
// 4.3 Delete tarball
//

// 5. Run postInstall hook
// 5.1 Get package dependencies
// 5.2 Recursively install dependencies of package using DFS
//

// 6. Close installation
// 6.1 Add package to package.json
// 6.2 Add package to joks-lock file
// 6.3 Print success message
//

/**
 *
 * @param {string} dependency - name of the package to be installed
 * @param {boolean} main - whether the package is being installed as a dependency of another package or not
 */
const install = async (dependency, main) => {
  try {
    // checking if package is already installed
    const installed = await checkDependency(dependency);
    if (installed) {
      if (main) {
        console.log(`Package ${dependency} is already installed!`);
      }
      return;
    }

    // downloading package details from npm registry
    const packageJson = await getPackageDetails(dependency);

    // preInstall hook
    await preInstall(dependency);

    // mainInstall hook
    await mainInstall(dependency, packageJson);

    // postInstall hook
    await postInstall(dependency, packageJson);

    // closeInstall hook
    if (main) {
      await closeInstall(dependency, packageJson);
    }
  } catch (error) {
    console.log(`Error installing ${dependency}: ${error}`);
  }
};

export default install;

/**
 * * Download package details from npm registry
 * @param {string} dependency - name of the package to be installed
 */
const getPackageDetails = async (dependency) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${dependency}`);
    const packageJson = await response.json();
    return packageJson;
  } catch (error) {
    if (error instanceof FetchError) {
      console.log(`Error installing ${dependency}: ${error.message}`);
    } else {
      console.error(error);
    }
  }
};
