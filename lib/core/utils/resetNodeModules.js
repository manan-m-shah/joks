import fs from 'fs-extra';
import getNodeModulesPath from './getPaths.js';

const resetNodeModules = () => {
    const nodeModulesPath = getNodeModulesPath();
    fs.removeSync(nodeModulesPath);
    fs.ensureDirSync(nodeModulesPath);
}

export default resetNodeModules;
