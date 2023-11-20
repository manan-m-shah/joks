// Directed Acyclic Graph implemention for maintaining a dependency tree

import semver from "semver";
import getPackageDetails from "../utils/getPackageDetails.js";
import { packageStore } from "../context.js";

class Node {
  constructor(name, requirement) {
    this.name = name;
    this.version = null;
    this.versionList = [];
    this.requirement = requirement;
    this.children = new Set();
    this.parent = new Set();
    this.root = false;
    this.dag = null;
    this.container = null;
    this.path = '/' + name;
  }

  setVersion = async (packageJson) => {
    if (!packageJson) {
      packageJson = packageStore.get(this.name) || await getPackageDetails(this.name);
      packageStore.set(this.name, packageJson);
    }
    if (this.requirement === "latest") {
      this.version = packageJson["dist-tags"]["latest"];
    } else {
      this.version = semver.maxSatisfying(this.versionList, this.requirement);
    }
  }

  setVersionList = async (packageJson) => {
    if (!packageJson) {
      packageJson = packageStore.get(this.name) || await getPackageDetails(this.name);
      packageStore.set(this.name, packageJson);
    }
    const versionList = Object.keys(packageJson.versions)
    this.versionList = versionList.filter((version) => semver.satisfies(version, this.requirement));
  }
}

class DAG {
  constructor(level) {
    this.nodes = new Map();
    this.level = level
  }

  addConflictingChild = (cNode) => {
    this.nodes.set(cNode.name, cNode);
  };

  addChildren = async (pNode, child) => {
    const [cName, cRequirement] = child;
    let cNode = new Node(cName, cRequirement);
    if (!this.nodes.has(cName)) {
      this.nodes.set(cName, cNode);
      cNode.container = this;
    } else {
      const settleStatus = await this.settle(this.nodes.get(cName), cNode);

      switch (settleStatus) {
        case 0: // conflict
          if (pNode.dag === null) {
            pNode.dag = new DAG(this.level + 1);
          }
          pNode.dag.addConflictingChild(cNode);
          cNode.container = pNode.dag;
          cNode.path = pNode.path + '/node_modules/' + cName;
          break;
        case 1: // satisfied
          cNode = this.nodes.get(cName);
          pNode.children.add(cNode);
          cNode.parent.add(pNode);
          return null;
        case 2: // updated
          cNode = this.nodes.get(cName);
          break;
      }
    }
    pNode.children.add(cNode);
    cNode.parent.add(pNode);

    return cNode;
  };

  createNode = (name, requirement) => {
    const pNode = new Node(name, requirement);
    pNode.root = true;
    pNode.dag = this;
    this.nodes.set(name, pNode);
    return pNode;
  }

  settle = async (a, b) => {
    const [ar, br] = [a.requirement, b.requirement];
    if (ar == br) {
      return 1;
    }

    if (a.versionList.length === 0) {
      await a.setVersionList();
    }

    const versionList = JSON.parse(JSON.stringify(a.versionList));
    const satisfyingVersionsA = versionList.filter((version) => semver.satisfies(version, ar));
    const satisfyingVersionsB = versionList.filter((version) => semver.satisfies(version, br));
    const commonVersions = satisfyingVersionsA.filter((version) => satisfyingVersionsB.includes(version));

    if (commonVersions.length === 0) {
      return 0;
    }

    const max = semver.maxSatisfying(commonVersions, "*");
    if (max == br) {
      a.versionList = commonVersions;
      return 1;
    } else if (max) {
      a.version = max;
      a.versionList = commonVersions;
      return 2;
    }

    return 0;
  }

  getNodeNamesAndVersions = () => {
    const nodeNamesAndVersions = [];
    for (const node of this.nodes.values()) {
      nodeNamesAndVersions.push([node.name, node.version]);
    }
    nodeNamesAndVersions.sort((a, b) => a[0].localeCompare(b[0]));
    return nodeNamesAndVersions;
  }

  getRoots = () => {
    const roots = [];
    for (const node of this.nodes.values()) {
      if (node.root) {
        roots.push(node);
      }
    }
    return roots;
  }
}

export default DAG;
