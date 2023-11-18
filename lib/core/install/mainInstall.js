// 4. Run mainInstall hook
// 4.1 Download tarball
// 4.2 Extract tarball
// 4.3 Delete tarball
//

import fs from "fs";
import path from "path";
import tar from "tar";
import getNodeModulesPath from "../utils/getPaths.js";

const mainInstall = async (pNode, packageJson) => {
  try {
    // get tarball url
    const tarballUrl =
      packageJson.versions[pNode.version].dist.tarball;

    // download tarball
    const response = await fetch(tarballUrl);
    const tarball = await response.arrayBuffer();

    // get dependency path
    const dependencyPath = getNodeModulesPath() + pNode.path;

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
  } catch (error) {
    throw new Error(`Failed main installation: ${error.message}`);
  }
};

export default mainInstall;
