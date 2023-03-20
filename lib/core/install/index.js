// ** main install function

import fetch, { FetchError } from "node-fetch";
import checkDependency from "../utils/checkDependency.js";

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
// 5.1 Recursively Install dependencies of package using DFS
//

// 6. Close installation
// 6.1 Add package to package.json
// 6.2 Add package to joks-lock file
// 6.3 Print success message
//

const install = async (dependency, main) => {
  try {
    // check if package is already installed
    const installed = await checkDependency(dependency);
    if (installed) {
      return;
    }

    // download package details from npm registry
    const packageJson = await getPackageDetails(dependency);
    console.log(packageJson)
  } catch (error) {
    console.log(`Error installing ${dependency}: ${error}`);
  }
};


export default install;

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
