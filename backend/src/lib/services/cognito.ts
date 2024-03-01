/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
    AdminCreateUserCommand,
    AdminCreateUserRequest,
    AdminDeleteUserCommand,
    AdminDeleteUserRequest,
    AdminUpdateUserAttributesCommand,
    AdminUpdateUserAttributesRequest,
    CognitoIdentityProviderClient,
    ListUsersCommand,
    ListUsersRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import logger from "./logger";
import packagejson from "../../../package.json";

/**
 * This class serves as a wrapper to the Cognito Identity Service Provider.
 * The primary benefit of this wrapper is to make testing of other
 * classes that use Cognito easier.  Mocking AWS services in unit testing
 * is a pain because of the promise() response structure.
 */
class CognitoService {
    private readonly cognitoClient: CognitoIdentityProviderClient;
    private static instance: CognitoService;
    private readonly options = {
        customUserAgent: packagejson.awssdkUserAgent + packagejson.version,
    };

    /**
     * CognitoService is a Singleton, hence private constructor
     * to prevent direct constructions calls with new operator.
     */
    private constructor() {
        this.cognitoClient = new CognitoIdentityProviderClient({
            ...this.options,
        });
    }

    /**
     * Controls access to the singleton instance.
     */
    static getInstance() {
        if (!CognitoService.instance) {
            CognitoService.instance = new CognitoService();
        }

        return CognitoService.instance;
    }

    async listUsers(input: ListUsersRequest) {
        logger.debug("Cognito ListUsers %o", input);
        const command = new ListUsersCommand(input);
        return await this.cognitoClient.send(command);
    }

    async addUser(input: AdminCreateUserRequest) {
        logger.debug("Cognito AdminCreateUser %o", input);
        const command = new AdminCreateUserCommand(input);
        return await this.cognitoClient.send(command);
    }

    async removeUser(input: AdminDeleteUserRequest) {
        logger.debug("Cognito AdminDeleteUser %o", input);
        const command = new AdminDeleteUserCommand(input);
        return await this.cognitoClient.send(command);
    }

    async updateUserAttributes(input: AdminUpdateUserAttributesRequest) {
        logger.debug("Cognito AdminUpdateUserAttributes %o", input);
        const command = new AdminUpdateUserAttributesCommand(input);
        return await this.cognitoClient.send(command);
    }
}

export default CognitoService;
