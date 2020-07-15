const fs = require('fs');

/**
 * Sample invocation
 * node createEnvFile.js gamma outputs-backend.json ../frontend/.env.production
 */
const environment = process.argv[2];
const sourceFile = process.argv[3];
const destFile = process.argv[4];

if(!environment || !destFile || !sourceFile) {
    throw new Error('Missing arguments on createEnvFile.js');
}

const data = fs.readFileSync("outputs-backend.json", {
    encoding:'utf8',
    flag:'r',
});

const cdkOutputs = JSON.parse(data);
const authOutputs = cdkOutputs[`Badger-${environment}-Auth`];
const backendOutputs = cdkOutputs[`Badger-${environment}-Backend`];

if(!authOutputs || !backendOutputs) {
    throw new Error('Expected outputs not found in cdk/outputs-backend.json');
}

const userPoolId = authOutputs["UserPoolId"];
const appClientId = authOutputs["AppClientId"];
const apiEndpoint = backendOutputs["ApiGatewayEndpoint"];
const awsRegion = userPoolId.split("_")[0];

const envData = `ENVIRONMENT=${environment}
REACT_APP_AWS_REGION=${awsRegion}
REACT_APP_BADGER_API=${apiEndpoint}
REACT_APP_USER_POOL_ID=${userPoolId}
REACT_APP_APP_CLIENT_ID=${appClientId}`;

fs.writeFileSync(destFile, envData);