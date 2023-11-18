import DAG from "../core/data-structures/dag.js";

const dag = new DAG(0);
const packageStore = new Map();
const allNodes = new Set();

export { dag, packageStore, allNodes}