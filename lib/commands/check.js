// check if a package is installed in node_modules folder

import fs from "fs";
import getPaths from "../core/getPaths.js";
import checkDependency from "../core/utils/checkDependency.js";

const check = (dependency) => {
  // check if package already exists in node_modules folder
  const installed = checkDependency(dependency);
  if (installed) {
    console.log(`${dependency} is already installed!`);
    return true;
  } else {
    return false;
  }
};

export default check;
