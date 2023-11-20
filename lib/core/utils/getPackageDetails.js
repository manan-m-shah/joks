import { performance } from 'perf_hooks'


let timer = 0;
/**
 * Download package details from npm registry
 * @param {string} pName - name of the package to be installed
 * @param {string} pVersion - version of the package to be installed
 */
const getPackageDetails = async (pName, pVersion) => {
    try {
        const start = performance.now();
        const response = await (pVersion ? fetch(`https://registry.npmjs.org/${pName}/${pVersion}`) : await fetch(`https://registry.npmjs.org/${pName}`));
        const packageJson = await response.json();
        const end = performance.now();
        timer += (end - start);
        return packageJson;
    } catch (error) {
        console.error(`Network Error while fetching package details of ${pName}@${pVersion}: ${error.message}`);
    }
};

export default getPackageDetails;
