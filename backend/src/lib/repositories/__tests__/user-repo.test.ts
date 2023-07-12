/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { Role } from "../../models/user";
import { mocked } from "ts-jest/utils";
import CognitoService from "../../services/cognito";
import UserRepository from "../user-repo";

jest.mock("../../services/cognito");

let userPoolId: string;
let repo: UserRepository;
const cognito = mocked(CognitoService.prototype);

beforeEach(() => {
    userPoolId = "abc";
    process.env.USER_POOL_ID = userPoolId;

    CognitoService.getInstance = jest.fn().mockReturnValue(cognito);
    repo = UserRepository.getInstance();
});

describe("UserRepository", () => {
    it("should be a singleton", () => {
        const repo2 = UserRepository.getInstance();
        expect(repo).toBe(repo2);
    });
});

describe("listUsers", () => {
    it("should list users using the correct userPoolId", async () => {
        // Mock response
        cognito.listUsers = jest.fn().mockReturnValue({});

        await repo.listUsers();

        expect(cognito.listUsers).toHaveBeenCalledWith({ UserPoolId: "abc" });
    });

    it("returns a list of users", async () => {
        // Mock query response
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
        cognito.listUsers = jest.fn().mockReturnValue({
            Users: [cognitoUser],
        });

        const list = await repo.listUsers();
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual({
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

describe("addUsers", () => {
    it("should call addUser with the correct parameters", async () => {
        await repo.addUsers([{ userId: "test", email: "test@example.com", roles: [Role.Admin] }]);
        expect(cognito.addUser).toHaveBeenCalledWith({
            UserPoolId: "abc",
            Username: "test",
            UserAttributes: [
                { Name: "email", Value: "test@example.com" },
                { Name: "custom:roles", Value: JSON.stringify([Role.Admin]) },
            ],
        });
    });
});

describe("resendInvite", () => {
    it("should call resendInvite with the correct parameters", async () => {
        await repo.resendInvite(["test"]);
        expect(cognito.addUser).toHaveBeenCalledWith({
            UserPoolId: "abc",
            Username: "test",
            MessageAction: "RESEND",
        });
    });
});

describe("changeRole", () => {
    it("should call changeRole with the correct parameters", async () => {
        await repo.changeRole(["test"], Role.Publisher);
        expect(cognito.updateUserAttributes).toHaveBeenCalledWith({
            UserPoolId: "abc",
            Username: "test",
            UserAttributes: [
                {
                    Name: "custom:roles",
                    Value: JSON.stringify([Role.Publisher]),
                },
            ],
        });
    });
});

describe("removeUsers", () => {
    it("should delete the users from the Cognito User Pool", async () => {
        await repo.removeUsers(["Bob", "Alice"]);
        expect(cognito.removeUser).toHaveBeenCalledWith({
            UserPoolId: "abc",
            Username: "Bob",
        });
        expect(cognito.removeUser).toHaveBeenCalledWith({
            UserPoolId: "abc",
            Username: "Alice",
        });
    });
});
