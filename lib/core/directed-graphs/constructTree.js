import getPackageDetails from "../utils/getPackageDetails.js";
import { dag, packageStore } from "../context.js";

const constructTree = async (pNode) => {
    const currDag = pNode.container || dag;
    const packageJson = packageStore.get(pNode.name) || await getPackageDetails(pNode.name);
    packageStore.set(pNode.name, packageJson);
    await pNode.setVersionList(packageJson);
    await pNode.setVersion(packageJson);
    const children = packageJson.versions[pNode.version]?.dependencies;

    const cNodes = [];
    for (const child in children) {
        const newChild = await currDag.addChild(pNode, [child, children[child]])
        if (newChild) {
            cNodes.push(constructTree(newChild));
        }
    }

    await Promise.all(cNodes);
}

export default constructTree;
