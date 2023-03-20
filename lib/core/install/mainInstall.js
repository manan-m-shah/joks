import fs from "fs";
import path from "path";
import tar from "tar";
import getPaths from "../getPaths.js";

const installDependency = async (dependency, packageJson) => {
  try {
    // get paths
    const { nodeModulesPath, dependencyPath } = getPaths();

    // get tarball url
    const tarballUrl =
      packageJson.versions[packageJson["dist-tags"].latest].dist.tarball;

    // download tarball
    const response = await fetch(tarballUrl);
    const tarball = await response.arrayBuffer();

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
      throw new Error(
        `Failed to create folder for ${dependency}: ${error.message}`
      );
    } else if (error instanceof TarError) {
      throw new Error(
        `Failed to extract tarball for ${dependency}: ${error.message}`
      );
    } else {
      throw new Error(`Failed to install ${dependency}: ${error.message}`);
    }
  }
};

export default installDependency;
