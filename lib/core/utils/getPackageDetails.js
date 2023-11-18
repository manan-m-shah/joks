import fetch, { FetchError } from 'node-fetch';

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
        if (error instanceof FetchError) {
            console.error(`Error fetching package details ${dependency}: ${error}`);
        } else {
            console.error(error);
        }
    }
};

export default getPackageDetails;