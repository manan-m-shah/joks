import install from "../core/install/index.js";
import getPackageDetails from "../core/utils/getPackageDetails.js";
import { dag, packageStore, allNodes } from "../core/context.js";
import { performance } from 'perf_hooks'

let count = 0;
const add = async (dependency) => {
  console.log("Building dependency tree...");
  const start = performance.now();
  const pNode = dag.createNode(dependency, "latest");
  await construct(pNode);

  console.log("Installing packages...");
  await install(pNode);
  const end = performance.now();

  console.log(`Installed ${count} packages in ${(end - start) / 1000} s`);
};

const construct = async (pNode) => {
  count++;

  const currDag = pNode.container || dag;
  const packageJson = packageStore.get(pNode.name) || await getPackageDetails(pNode.name);
  packageStore.set(pNode.name, packageJson);
  await pNode.setVersionList(packageJson);
  await pNode.setVersion(packageJson);
  const children = packageJson.versions[pNode.version]?.dependencies;

  const cNodes = [];
  for (const child in children) {
    const newChild = await currDag.addChildren(pNode, [child, children[child]])
    if (newChild) {
      cNodes.push(construct(newChild));
    }
  }

  await Promise.all(cNodes);
}

export default add;
