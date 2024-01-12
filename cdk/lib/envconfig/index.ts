/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const frontendBucket = process.env.FRONTEND_BUCKET;

const client = new S3Client({});

export const handler = async (event: any): Promise<void> => {
    console.log("Event=", JSON.stringify(event));

    const requestType = event.RequestType;
    if (requestType === "Create") {
        return await uploadConfig();
    }

    if (requestType === "Update") {
        return await uploadConfig();
    }

    // On Delete do nothing
    console.log("On Delete do nothing");
    return await Promise.resolve();
};

const uploadConfig = async () => {
    if (!frontendBucket) {
        throw new Error("FRONTEND_BUCKET env variable not defined");
    }

    const content = getConfigContent();

    const command = new PutObjectCommand({
        Bucket: frontendBucket,
        Key: "env.js",
        Body: content,
        ContentType: "application/javascript",
    });
    const response = await client.send(command);

    console.log("S3 putObject result = ", response);
};

function getConfigContent(): string {
    const config = {
        region: process.env.REGION,
        backendApi: process.env.BACKEND_API,
        userPoolId: process.env.USER_POOL_ID,
        appClientId: process.env.APP_CLIENT_ID,
        datasetsBucket: process.env.DATASETS_BUCKET,
        contentBucket: process.env.CONTENT_BUCKET,
        identityPoolId: process.env.IDENTITY_POOL_ID,
        contactEmail: process.env.CONTACT_EMAIL,
        brandName: process.env.BRAND_NAME,
        topicAreaLabel: process.env.TOPIC_AREA_LABEL,
        topicAreasLabel: process.env.TOPIC_AREAS_LABEL,
        frontendDomain: process.env.FRONTEND_DOMAIN,
        cognitoDomain: process.env.COGNITO_DOMAIN,
        samlProvider: process.env.SAML_PROVIDER,
        enterpriseLoginLabel: process.env.ENTERPRISE_LOGIN_LABEL,
        authenticationRequired: process.env.AUTHENTICATION_REQUIRED?.toLowerCase() === "yes",
    };

    return `
const env = ${JSON.stringify(config)}
window.EnvironmentConfig = env;
  `;
}
