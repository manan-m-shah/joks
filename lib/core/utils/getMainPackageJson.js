// return the main package.json file

import fs from "fs";
import path from "path";
const mainPackageJson = "./package.json";

const getMainPackageJson = () => {
  try {
    const mainPackageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
    );
    return mainPackageJson;
  } catch (error) {
    throw new Error(`Failed to read package.json: ${error.message}`);
  }
};

export default getMainPackageJson;