import install from ".";

const postInstall = async (dependency, packageJson) => {
  const dependencies = getPackageDependencies(packageJson);

  try {
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

const getPackageDependencies = (packageJson) => {
  // get latest version of package
  const latestVersion = packageJson["dist-tags"].latest;

  // get dependencies object of latest version
  const dependencies = packageJson.versions[latestVersion].dependencies;

  return dependencies;
};

export default postInstall;
