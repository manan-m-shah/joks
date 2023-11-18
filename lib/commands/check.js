// check if a package is installed in node_modules folder

import checkDependency from "../core/utils/checkDependency.js";

const check = async (dependency) => {
  // check if package already exists in node_modules folder
  const installed = await checkDependency(dependency);
  if (installed) {
    console.log(`${dependency} is installed!`);
    return true;
  } else {
    console.log(`${dependency} is not installed!`);
    return false;
  }
};

export default check;
