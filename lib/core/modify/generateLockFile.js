import fs from "fs";
import path from "path";

const generateLockFile = async () => {
  // Read package.json file
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));

  // Read installed dependencies from package.json
  const installedDependencies = Object.keys(packageJson.dependencies);

  // Create a new object to hold the lockfile data
  const lockfileData = {};

  // Loop through all the installed dependencies
  for (const dependency of installedDependencies) {
    // Get the dependency's package.json file
    const dependencyJsonPath = path.join(
      "./node_modules",
      dependency,
      "package.json"
    );
    const dependencyJson = JSON.parse(fs.readFileSync(dependencyJsonPath));

    // Add the dependency to the lockfile
    lockfileData[dependency] = {
      version: dependencyJson.version,
      dependencies: dependencyJson.dependencies,
    };
  }

  // Write the lockfile to a file
  fs.writeFileSync("./joks-lock.json", JSON.stringify(lockfileData, null, 2));
};

export default generateLockFile;
