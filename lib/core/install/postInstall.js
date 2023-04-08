// 5. Run postInstall hook
// 5.1 Get package dependencies
// 5.2 Recursively install dependencies of package using DFS
//

import install from "./index.js";

const postInstall = async (dependency, packageJson) => {
  const dependencies = getPackageDependencies(packageJson);

  try {
    if (dependencies) {
      // install dependencies
      for (const dependency in dependencies) {
        console.log(`Installing package ${dependency}...`);
        await install(dependency, false);
      }
    }
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Failed to install ${dependency}: ${error.message}`);
    } else {
      throw new Error(`Failed to install ${dependency}: ${error.message}`);
    }
  }
};

const getPackageDependencies = (packageJson) => {
  // get latest version of package
  const latestVersion = packageJson["dist-tags"].latest;

  // get dependencies object of latest version
  const dependencies = packageJson.versions[latestVersion].dependencies;

  return dependencies;
};

export default postInstall;
