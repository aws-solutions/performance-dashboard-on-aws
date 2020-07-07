import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export class AuthStack extends cdk.Stack {
    public readonly userPoolArn : string;
    public readonly appClientId : string;
    public readonly userPoolId  : string;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pool = new cognito.UserPool(this, 'BadgerUserPool');
        const client = pool.addClient('BadgerFrontend');

        /**
         * Outputs
         */
        this.userPoolArn = pool.userPoolArn;
        this.appClientId = client.userPoolClientId;
        this.userPoolId = pool.userPoolId;

        new cdk.CfnOutput(this, 'UserPoolArn', { value: this.userPoolArn });
        new cdk.CfnOutput(this, 'AppClientId', { value: this.appClientId });
        new cdk.CfnOutput(this, 'UserPoolId', { value: this.userPoolId });
    }
}