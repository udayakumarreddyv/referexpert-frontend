
// Check if an api status code does not match 200
// If so throw an error as the request has failed
exports.checkForBadResponse = ({ status, functionName }) => {
    if (status !== 200) throw `Failed to fetch data from api request; function: ${functionName}`;
};