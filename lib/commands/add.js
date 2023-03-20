import fetch from "node-fetch";
import check from "./check.js";
import path from "path";
import tar from "tar";
import fs from "fs";
import generateLockFile from "../core/modify/generateLockFile.js";
import checkDependency from "../core/utils/checkDependency.js";
import install from "../core/install/index.js";

const add = async (dependency) => {
  install(dependency, true);
};

// const install = async (dependency, main) => {
//   try {
//     const response = await fetch(`https://registry.npmjs.org/${dependency}`);
//     const packageJson = await response.json();

//     // check if package is already installed
//     const installed = await checkDependency(dependency);
//     if (installed) {
//       return;
//     }

//     // if no, proceed with installation
//     console.log(`Installing ${dependency}...`);

//     // preinstall hook
//     const preInstallSuccess = await preinstall(dependency, packageJson);

//     if (!preInstallSuccess) {
//       console.log(`Error installing ${dependency}: preinstall hook failed!`);
//       return;
//     }

//     // code for installing the package
//     const installSuccess = await installDependency(dependency, packageJson);

//     // postinstall hook
//     const postInstallSuccess = await postinstall(dependency, packageJson);

//     if (!postInstallSuccess) {
//       console.log(`Error installing ${dependency}: postinstall hook failed!`);
//       return;
//     }

//     // add package to package.json
//     if (main) {
//       addPackageToPackageJson(dependency, packageJson);
//     }

//     // successful installation message
//     if (installSuccess) {
//       console.log(`Successfully installed ${dependency}!`);
//     }
//   } catch (error) {
//     console.log(`Error installing ${dependency}: ${error}`);
//   }
// };

// const addPackageToPackageJson = (dependency, packageJson) => {
//   try {
//     let packageJsonFile = {};

//     const data = fs.readFileSync("./package.json");
//     packageJsonFile = JSON.parse(data.toString());
    
//     // add dependency to package.json
//     if (!packageJsonFile.dependencies) {
//       packageJsonFile.dependencies = {};
//     }

//     packageJsonFile.dependencies[packageJson.name] =
//       packageJson["dist-tags"].latest;
//     console.log(packageJsonFile.dependencies);
//     fs.writeFileSync(
//       "./package.json",
//       JSON.stringify(packageJsonFile, null, 2)
//     );

//     generateLockFile()
//   } catch (error) {
//     console.log(`Error adding ${dependency} to package.json: ${error}`);
//   }
// };

export default add;
