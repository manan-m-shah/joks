import { performance } from 'perf_hooks';
import { dag } from "../core/context.js";
import constructTree from "../core/directed-graphs/constructTree.js";
import install from "../core/install/index.js";

const add = async (dependency) => {
  const start = performance.now();
  console.log("Building dependency tree...");
  await dag.init();
  dag.deleteRoot(dependency);
  const rootNodes = dag.getRootNodes();
  await Promise.all(rootNodes.map((node) => constructTree(node)));
  await install();

  const end = performance.now();
  console.log(`${Math.floor((end - start) / 1000)}s Good to go!`);
};

export default add;
