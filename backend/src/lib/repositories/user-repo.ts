/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { User } from "../models/user";
import UserFactory from "../factories/user-factory";
import CognitoService from "../services/cognito";
import logger from "../services/logger";

class UserRepository {
    protected static instance: UserRepository;
    protected cognito: CognitoService;
    protected userPoolId: string;

    private constructor() {
        if (!process.env.USER_POOL_ID) {
            throw new Error("Environment variable USER_POOL_ID not found");
        }

        this.cognito = CognitoService.getInstance();
        this.userPoolId = process.env.USER_POOL_ID;
    }

    static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }

        return UserRepository.instance;
    }

    public async listUsers(): Promise<User[]> {
        const result = await this.cognito.listUsers({
            UserPoolId: this.userPoolId,
        });

        if (!result.Users || result.Users.length === 0) {
            return [];
        }

        return result.Users.map((cognitoUser) => UserFactory.fromCognitoUser(cognitoUser));
    }

    public async addUsers(users: User[]) {
        for (const user of users) {
            await this.cognito.addUser({
                UserPoolId: this.userPoolId,
                Username: user.userId,
                UserAttributes: [
                    { Name: "email", Value: user.email },
                    { Name: "custom:roles", Value: JSON.stringify(user.roles) },
                ],
            });
        }
    }

    public async removeUsers(users: string[]) {
        try {
            for (const user of users) {
                logger.debug("Deleting %s from userPool %s", user, this.userPoolId);
                await this.cognito.removeUser({
                    UserPoolId: this.userPoolId,
                    Username: user,
                });
            }
        } catch (error) {
            logger.error("Failed to delete user(s) in Cognito %o", error);
            throw error;
        }
    }

    public async resendInvite(usernames: string[]) {
        for (const username of usernames) {
            await this.cognito.addUser({
                UserPoolId: this.userPoolId,
                Username: username,
                MessageAction: "RESEND",
            });
        }
    }

    public async changeRole(usernames: string[], role: string) {
        for (const username of usernames) {
            await this.cognito.updateUserAttributes({
                UserPoolId: this.userPoolId,
                Username: username,
                UserAttributes: [{ Name: "custom:roles", Value: JSON.stringify([role]) }],
            });
        }
    }
}

export default UserRepository;
