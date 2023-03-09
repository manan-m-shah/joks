import fetch from "node-fetch";
import check from "./check.js";
import path from "path";
import tar from "tar";
import fs from "fs";
import generateLockFile from "../core/generateLockFile.js";

const add = async (dependency) => {
  install(dependency, true);
};

const install = async (dependency, main) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${dependency}`);
    const packageJson = await response.json();

    // check if package is already installed
    const installed = await checkDependency(dependency);
    if (installed) {
      return;
    }

    // if no, proceed with installation
    console.log(`Installing ${dependency}...`);

    // preinstall hook
    const preInstallSuccess = await preinstall(dependency, packageJson);

    if (!preInstallSuccess) {
      console.log(`Error installing ${dependency}: preinstall hook failed!`);
      return;
    }

    // code for installing the package
    const installSuccess = await installDependency(dependency, packageJson);

    // postinstall hook
    const postInstallSuccess = await postinstall(dependency, packageJson);

    if (!postInstallSuccess) {
      console.log(`Error installing ${dependency}: postinstall hook failed!`);
      return;
    }

    // add package to package.json
    if (main) {
      addPackageToPackageJson(dependency, packageJson);
    }

    // successful installation message
    if (installSuccess) {
      console.log(`Successfully installed ${dependency}!`);
    }
  } catch (error) {
    console.log(`Error installing ${dependency}: ${error}`);
  }
};

const checkDependency = async (dependency) => {
  try {
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);
    // check if package already exists in node_modules folder
    const installed = check(dependency);
    if (installed) {
      console.log(`${dependency} is already installed!`);
      return true;
    }
  } catch (error) {
    console.log(`Error checking if ${dependency} is installed: ${error}`);
    return false;
  }
};

const preinstall = async (dependency, packageJson) => {
  try {
    // create folder for package
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);

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

const installDependency = async (dependency, packageJson) => {
  try {
    // get tarball url
    const tarballUrl =
      packageJson.versions[packageJson["dist-tags"].latest].dist.tarball;

    // download tarball
    const response = await fetch(tarballUrl);
    const tarball = await response.arrayBuffer();

    // extract tarball
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);

    // write tarball to file
    fs.writeFileSync(
      path.join(dependencyPath, "package.tgz"),
      Buffer.from(tarball)
    );

    // extract tarball from file
    await tar.x({
      file: path.join(dependencyPath, "package.tgz"),
      cwd: dependencyPath,
      strip: 1,
    });

    // delete tarball file
    fs.unlinkSync(path.join(dependencyPath, "package.tgz"));

    // return true due to successful installation
    return true;
  } catch (error) {
    if (error instanceof FetchError) {
      throw new Error(`Failed to download ${dependency}: ${error.message}`);
    } else if (error instanceof NodeError) {
      throw new Error(`Failed to create folder for ${dependency}: ${error.message}`);
    } else if (error instanceof TarError) {
      throw new Error(`Failed to extract tarball for ${dependency}: ${error.message}`);
    } else {
      throw new Error(`Failed to install ${dependency}: ${error.message}`);
    }
  }
};


const postinstall = async (dependency, packageJson) => {
  try {
    // check if package has dependencies

    // get latest version of package
    const latestVersion = packageJson["dist-tags"].latest;

    // get dependencies object of latest version
    const dependencies = packageJson.versions[latestVersion].dependencies;
    if (dependencies) {
      // install dependencies
      for (const dependency in dependencies) {
        console.log(`Installing package ${dependency}...`);
        await install(dependency);
      }
    } else {
      console.log(`${dependency} has no dependencies.`);
    }
    return true;
  } catch (error) {
    console.log(`Error running postinstall hook for ${dependency}: ${error}`);
    return false;
  }
};

const addPackageToPackageJson = (dependency, packageJson) => {
  try {
    let packageJsonFile = {};

    const data = fs.readFileSync("./package.json");
    packageJsonFile = JSON.parse(data.toString());
    
    // add dependency to package.json
    if (!packageJsonFile.dependencies) {
      packageJsonFile.dependencies = {};
    }

    packageJsonFile.dependencies[packageJson.name] =
      packageJson["dist-tags"].latest;
    console.log(packageJsonFile.dependencies);
    fs.writeFileSync(
      "./package.json",
      JSON.stringify(packageJsonFile, null, 2)
    );

    generateLockFile()
  } catch (error) {
    console.log(`Error adding ${dependency} to package.json: ${error}`);
  }
};

export default add;
