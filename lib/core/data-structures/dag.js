// Directed Acyclic Graph implemention for maintaining a dependency tree

class Node {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.parent = [];
  }
}

class DAG {
  constructor() {
    this.nodes = new Map();
  }

  addNode = (name) => {
    this.nodes.set(name, new Node(name));
  };

  addChildren = (parent, child) => {
    if (!this.nodes.has(parent)) {
      this.addNode(parent);
    }
    if (!this.nodes.has(child)) {
      this.addNode(child);
    }
    this.nodes.get(child).parent.push(parent);
    this.nodes.get(parent).children.push(child);
  };

  getChildren = (name) => {
    if (!this.nodes.has(name)) {
      return null;
    }
    return this.nodes.get(name).children;
  };

  getParents = (name) => {
    if (!this.nodes.has(name)) {
      return null;
    }
    return this.nodes.get(name).parent;
  };

  getNodes = () => {
    return this.nodes;
  };

  _removeParent = (parent, child) => {
    if (!this.nodes.has(parent) || !this.nodes.has(child)) {
      return;
    }
    this.nodes.get(parent).children = this.nodes
      .get(parent)
      .children.filter((node) => node !== child);
    this.nodes.get(child).parent = this.nodes
      .get(child)
      .parent.filter((node) => node !== parent);
  };

  deleteNode = (name) => {
    if (!this.nodes.has(name)) {
      return;
    }
    const children = this.nodes.get(name).children;
    children.forEach((child) => {
      this.removeParent(name, child);
      // check if the child has any parents
      const parents = this.nodes.get(child).parent;
      if (parents.length === 0) {
        this.deleteNode(child);
      }
    });
    this.nodes.delete(name);
  };
}

export default DAG;
