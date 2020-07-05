import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export class AuthStack extends cdk.Stack {
    public readonly userPoolArn : string;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pool = new cognito.UserPool(this, 'BadgerUserPool');
        const client = pool.addClient('BadgerFrontend');

        /**
         * Outputs
         */
        this.userPoolArn = pool.userPoolArn;
        new cdk.CfnOutput(this, 'AppClientId', { value: client.userPoolClientId });
        new cdk.CfnOutput(this, 'UserPoolId', { value: pool.userPoolId });
    }
}