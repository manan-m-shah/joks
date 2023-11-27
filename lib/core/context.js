import DAG from "./directed-graphs/dag.js";

const dag = new DAG(0);
const packageStore = new Map();
const allNodes = new Set();

export { dag, packageStore, allNodes}