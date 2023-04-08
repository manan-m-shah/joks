import path from "path";

const getPaths = (dependency) => {
  if (!dependency) {
    console.error("No dependency provided");
    throw new Error("No dependency provided");
  }

  const nodeModulesPath = path.join(process.cwd(), "node_modules");
  const dependencyPath = path.join(nodeModulesPath, dependency);

  return { nodeModulesPath, dependencyPath };
};

export default getPaths;
