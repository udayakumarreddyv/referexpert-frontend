
// User for creating basic authentication header for api calls
function createBasicAuth () {
    return `Basic ${btoa('user:password')}`;
};

export default createBasicAuth;