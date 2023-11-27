// 5. Run postInstall hook
// 5.1 Get package dependencies
// 5.2 Recursively install dependencies of package using DFS
//

import { installPackage } from "./index.js";

const postInstall = async (pNode) => {
  const children = [...pNode.children];
  try {
    await Promise.all(children.map((child) => installPackage(child)));
  } catch (error) {
    throw new Error(`Failed to install ${pNode.name}: ${error.message}`);
  }
};

export default postInstall;
