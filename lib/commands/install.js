import fetch from "node-fetch";
import check from "./check.js";
import path from "path";
import tar from "tar";
import fs from "fs";

const install = async (dependency) => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${dependency}`);
    const packageJson = await response.json();
    
    // if no, proceed with installation
    console.log(`Installing ${dependency}...`);

    // preinstall hook
    const preInstallSuccess = await preinstall(dependency, packageJson);

    if (!preInstallSuccess) {
      console.log(`Error installing ${dependency}: preinstall hook failed!`);
      return;
    }

    // code for installing the package
    const installSuccess = await installPackage(dependency, packageJson);

    // postinstall hook
    const postInstallSuccess = await postinstall(dependency, packageJson);

    // successful installation message
    if (installSuccess) {
      console.log(`Successfully installed ${dependency}!`);
    }

  } catch (error) {
    console.log(`Error installing ${dependency}: ${error}`);
  }
};

const preinstall = async (dependency, packageJson) => {
  try {
    // check if package already exists in node_modules folder
    const installed = check(dependency);
    if (installed) {
      console.log(`${dependency} is already installed!`);
      return false;
    }

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

const installPackage = async (dependency, packageJson) => {
  try {
    // get tarball url
    const tarballUrl = packageJson.versions[packageJson["dist-tags"].latest].dist.tarball;

    // download tarball
    const response = await fetch(tarballUrl);
    const tarball = await response.arrayBuffer();

    // extract tarball
    const nodeModulesPath = path.join(process.cwd(), "node_modules");
    const dependencyPath = path.join(nodeModulesPath, dependency);

    // write tarball to file
    fs.writeFileSync(path.join(dependencyPath, "package.tgz"), Buffer.from(tarball));

    // extract tarball from file
    await tar.x({
      file: path.join(dependencyPath, "package.tgz"),
      cwd: dependencyPath,
      strip: 1,
    });

    // delete tarball file
    fs.unlinkSync(path.join(dependencyPath, "package.tgz"))
    
    // return true due to successful installation
    return true;
  } catch (error) {
    console.log(`Error installing ${dependency}: ${error}`);
    return false;
  }
};

const postinstall = async (dependency, packageJson) => {
  // check if package has dependencies
  if (packageJson.dependencies) {
    // install dependencies
    for (const dependency in packageJson.dependencies) {
      await install(dependency);
    }
  } else {
    console.log(`${dependency} has no dependencies.`);
  }
}

export default install;
