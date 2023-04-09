import fetch from "node-fetch";
import check from "./check.js";
import path from "path";
import tar from "tar";
import fs from "fs";
import generateLockFile from "../core/modify/generateLockFile.js";
import checkDependency from "../core/utils/checkDependency.js";
import install from "../core/install/index.js";

const add = async (dependency) => {
  install(dependency, true);
};

export default add;
