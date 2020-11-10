import AWS = require("aws-sdk");

const frontendBucket = process.env.FRONTEND_BUCKET;

export const handler = (event: any) => {
  console.log("Event=", JSON.stringify(event));
  console.log("Environment variables = ", JSON.stringify(process.env));

  const requestType = event.RequestType;
  if (requestType === "Create") {
    return uploadConfig();
  }

  if (requestType === "Update") {
    return uploadConfig();
  }

  return;
};

const uploadConfig = async () => {
  if (!frontendBucket) {
    throw new Error("FRONTEND_BUCKET env variable not defined");
  }

  const s3 = new AWS.S3();
  const content = getConfigContent();
  const result = await s3
    .putObject({
      Bucket: frontendBucket,
      Key: "env.js",
      Body: content,
      ContentType: "application/javascript",
    })
    .promise();

  console.log("S3 putObject result = ", result);
  return;
};

function getConfigContent(): string {
  const config = {
    region: process.env.REGION,
    backendApi: process.env.BACKEND_API,
    userPoolId: process.env.USER_POOL_ID,
    appClientId: process.env.APP_CLIENT_ID,
    datasetsBucket: process.env.DATASETS_BUCKET,
    identityPoolId: process.env.IDENTITY_POOL_ID,
    contactEmail: process.env.CONTACT_EMAIL,
    brandName: process.env.BRAND_NAME,
    topicAreaLabel: process.env.TOPIC_AREA_LABEL,
  };

  return `
const env = ${JSON.stringify(config)}
window.EnvironmentConfig = env;
  `;
}
