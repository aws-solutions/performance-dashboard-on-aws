/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { Role } from "../../models/user";
import UserFactory from "../user-factory";

describe("createNew", () => {
    it("should create a new user with userId and email", () => {
        const user = UserFactory.createNew("test@example.com", "Admin");
        expect(user.userId).toEqual("test");
        expect(user.email).toEqual("test@example.com");
        expect(user.roles).toEqual([Role.Admin]);
    });
});

describe("fromCognitoUser", () => {
    it("converts a cognito user to a user", () => {
        const now = new Date();
        const cognitoUser: UserType = {
            Username: "test user",
            Enabled: true,
            UserStatus: "CONFIRMED",
            Attributes: [
                {
                    Name: "sub",
                    Value: "123",
                },
                { Name: "email", Value: "test@example.com" },
                { Name: "custom:roles", Value: '["Admin"]' },
            ],
            UserCreateDate: now,
            UserLastModifiedDate: now,
        };

        const user = UserFactory.fromCognitoUser(cognitoUser);
        expect(user).toEqual({
            userId: "test user",
            enabled: true,
            userStatus: "CONFIRMED",
            sub: "123",
            email: "test@example.com",
            roles: [Role.Admin],
            createdAt: now,
            updatedAt: now,
        });
    });
});
