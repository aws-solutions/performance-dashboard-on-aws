/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
    StringAttribute,
    UserPool,
    UserPoolClient,
    AdvancedSecurityMode,
    CfnIdentityPool,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { Stack, StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import { readFileSync } from "fs";
import { NagSuppressions } from "cdk-nag";

interface Props extends StackProps {
    datasetsBucketName: string;
    contentBucketName: string;
    authenticationRequired: boolean;
}

export class AuthStack extends Stack {
    public readonly userPoolArn: string;
    public readonly appClientId: string;
    public readonly userPoolId: string;
    public readonly identityPoolId: string;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        const pool = new UserPool(this, "UserPool", {
            userInvitation: {
                emailSubject:
                    "You have been invited to the {Organization} Performance Dashboard on AWS.",
                emailBody: readFileSync("lib/data/email-template.html").toString(),
            },
            customAttributes: { roles: new StringAttribute({ mutable: true }) },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true,
                tempPasswordValidity: Duration.days(3),
            },
            advancedSecurityMode: AdvancedSecurityMode.ENFORCED,
        });

        const client = pool.addClient("Frontend", {
            preventUserExistenceErrors: true,
        });
        const identityPool = this.buildIdentityPool(pool, client, props.authenticationRequired);

        /**
         * Outputs
         */
        this.userPoolArn = pool.userPoolArn;
        this.appClientId = client.userPoolClientId;
        this.userPoolId = pool.userPoolId;
        this.identityPoolId = identityPool.ref;

        new CfnOutput(this, "UserPoolArn", { value: this.userPoolArn });
        new CfnOutput(this, "AppClientId", { value: this.appClientId });
        new CfnOutput(this, "UserPoolId", { value: this.userPoolId });
        new CfnOutput(this, "IdentityPoolId", { value: this.identityPoolId });
    }

    private buildIdentityPool(
        userPool: UserPool,
        userPoolClient: UserPoolClient,
        authenticationRequired: boolean,
    ) {
        const identityPool = new CfnIdentityPool(this, "IdentityPool", {
            allowUnauthenticatedIdentities: !authenticationRequired,
            cognitoIdentityProviders: [
                {
                    clientId: userPoolClient.userPoolClientId,
                    providerName: userPool.userPoolProviderName,
                    serverSideTokenCheck: true,
                },
            ],
        });
        NagSuppressions.addResourceSuppressions(identityPool, [
            {
                id: "AwsSolutions-COG7",
                reason: "Use case allows unauthenticated users to access S3 objects",
            },
            {
                id: "W57",
                reason: "Use case allows unauthenticated users to access S3 objects",
            },
        ]);
        return identityPool;
    }
}
