// make dependency tree

// * Steps for making dependency tree
// 1. Get principal packages from package.json
// 2. Recursively get dependencies of principal packages and add them to the tree
// 3. Return the tree

import DAG from "../data-structures/dag.js";
import fs from "fs";
import path from "path";
const packageJson = "package.json";

const getDependencyTree = async () => {
  const principalPackages = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), packageJson), "utf8")
  );
  const principalPackagesDependencies = Object.keys(
    principalPackages.dependencies
  );
};

const makeDependencyTree = async (dependencies) => {
  const dependencyTree = new DAG();
  for (const dependency of dependencies) {
    const packageJson = await getPackageDetails(dependency);
    const dependencyDependencies = Object.keys(packageJson.dependencies);
    dependencyTree.addChildren(dependency, dependencyDependencies);
    makeDependencyTree(dependencyDependencies);
  }
};

getDependencyTree();
