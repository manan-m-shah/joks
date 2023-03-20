import check from "./check.js";
import path from "path";
import fs from "fs";
import getPackageJson from "../core/utils/getPackageJson.js";

const remove = async (dependency) => {
  uninstall(dependency);
};

const uninstall = async (dependency, main) => {
  const installed = await checkDependency(dependency);
  if (!installed) {
    return;
  }

  const preUninstallHook = await preUninstall(dependency);

  const uninstallHook = await uninstallPackage(dependency);

  const postUninstallHook = await postUninstall(dependency);

  if (!main) {
    const removePackageFromPackageJsonHook = await removePackageFromPackageJson(
      dependency
    );
  }
};

//* check if package is installed
const checkDependency = async (dependency) => {
  try {
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);
    // check if package already exists in node_modules folder
    const installed = check(dependency);
    if (!installed) {
      console.log(`No dependency named "${dependency}" found`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(`Error checking if ${dependency} is installed: ${error}`);
    return false;
  }
};

//* preUninstall hook
// uninstalls package dependencies
const preUninstall = async (dependency) => {
  // get package.json
  const packageJson = await getPackageJson(dependency);
  // get dependencies
  const dependencies = packageJson.dependencies;
  const devDependencies = packageJson.devDependencies;

  // uninstall dependencies
  if (dependencies) {
    for (const dependency in dependencies) {
      await uninstall(dependency);
    }
  }

  // uninstall devDependencies
  if (devDependencies) {
    for (const dependency in devDependencies) {
      await uninstall(dependency);
    }
  }
};

//* uninstalls package
const uninstallPackage = async (dependency) => {
  const nodeModulesPath = path.join(process.cwd(), "node_modules");
  const dependencyPath = path.join(nodeModulesPath, dependency);

  // remove package folder
  fs.rmdirSync(dependencyPath, { recursive: true });
};

//* postUninstall hook
const postUninstall = async (dependency) => {
    console.log(`Successfully uninstalled ${dependency}!`);
};

//* remove package from package.json
const removePackageFromPackageJson = async (dependency) => {
  try {
    let packageJsonFile = {};

    const data = fs.readFileSync("./package.json");
    packageJsonFile = JSON.parse(data.toString());

    // add dependency to package.json
    if (!packageJsonFile.dependencies) {
      packageJsonFile.dependencies = {};
    }

    // remove dependency from package.json
    delete packageJsonFile.dependencies[dependency];
    // console.log(packageJsonFile.dependencies);
    fs.writeFileSync(
      "./package.json",
      JSON.stringify(packageJsonFile, null, 2)
    );
  } catch (error) {
    console.log(`Error deleting ${dependency} to package.json: ${error}`);
  }
};

export default remove;
