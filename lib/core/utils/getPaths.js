import path from "path";

const getNodeModulesPath = () => {
  return path.join(process.cwd(), "node_modules");
}


export default getNodeModulesPath;
