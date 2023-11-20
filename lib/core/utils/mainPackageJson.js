// return the main package.json file

import fs from "fs";
import path from "path";

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

const setMainPackageJson = (mainPackageJson) => {
  try {
    fs.writeFileSync(
      path.join(process.cwd(), "package.json"),
      JSON.stringify(mainPackageJson, null, 2)
    );
  } catch (error) {
    throw new Error(`Failed to write package.json: ${error.message}`);
  }
}

export { getMainPackageJson, setMainPackageJson };
