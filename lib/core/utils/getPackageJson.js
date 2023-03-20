import path from "path";
import fs from "fs";

// gets package.json of a dependency from node_modules
const getPackageJson = async (dependency) => {
  try {
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);
    const packageJsonPath = path.join(dependencyPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return packageJson;
  } catch (error) {
    console.log(`Error getting package.json for ${dependency}: ${error}`);
    return null;
  }
};

export default getPackageJson;