/**
 * Download package details from npm registry
 * @param {string} pName - name of the package to be installed
 * @param {string} pVersion - version of the package to be installed
 */
const getPackageDetails = async (pName, pVersion) => {
    try {
        if (!pVersion) {
            const response = await fetch(`https://registry.npmjs.org/${pName}`);
            const packageJson = await response.json();
            return packageJson;
        } else {
            const response = await fetch(`https://registry.npmjs.org/${pName}/${pVersion}`);
            const packageJson = await response.json();
            return packageJson;
        }
    } catch (error) {
        console.error(`Network Error while fetching package details of ${pName}@${pVersion}`);
    }
};

export default getPackageDetails;
