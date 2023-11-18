// 5. Run postInstall hook
// 5.1 Get package dependencies
// 5.2 Recursively install dependencies of package using DFS
//

import install from "./index.js";

const postInstall = async (pNode) => {
  const children = pNode.children;
  try {
    const cNodes = [];
    for (const child of children) {
      cNodes.push(install(child));
    }
    await Promise.all(cNodes);
  } catch (error) {
    throw new Error(`Failed to install ${pNode.name}: ${error.message}`);
  }
};

export default postInstall;
