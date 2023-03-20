import getPaths from "../getPaths";

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
    console.log(`Error running preinstall hook for ${dependency}: ${error}`);
    return false;
  }
};

export default preInstall;
