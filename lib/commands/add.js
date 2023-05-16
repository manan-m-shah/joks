import install from "../core/install/index.js";

const add = async (dependency) => {
  install(dependency, true);
};

export default add;
