#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FrontendStack } from '../lib/frontend-stack';
import { BackendStack } from '../lib/backend-stack';
import { AuthStack } from '../lib/auth-stack';

interface EnvProps {
    envName: string,
}

class Badger extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: EnvProps) {
        super(scope, id);

        const prefix = "Badger-".concat(props.envName)
        new FrontendStack(app, 'Frontend', {
            stackName: prefix.concat('-Frontend'),
        });

        new BackendStack(app, 'Backend', {
            stackName: prefix.concat('-Backend'),
        });

        new AuthStack(app, 'Auth', {
            stackName: prefix.concat('-Auth'),
        });
    }
}

/**
 * What environment are we deploying to
 */
if(!process.env.BADGER_ENV) {
    throw new Error('Please specify stage with BADGER_ENV env variable');
}

const envProps : EnvProps = {
    envName: process.env.BADGER_ENV,
};

const app = new cdk.App();
new Badger(app, "Badger", envProps);