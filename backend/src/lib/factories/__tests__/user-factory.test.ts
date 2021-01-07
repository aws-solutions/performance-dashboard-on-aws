import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import UserFactory from "../user-factory";

describe("toUser", () => {
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
        { Name: "email_verified", Value: "true" },
        { Name: "email", Value: "test@test.com" },
      ],
      UserCreateDate: now,
      UserLastModifiedDate: now,
    };

    const user = UserFactory.toUser(cognitoUser);
    expect(user).toEqual({
      userId: cognitoUser.Username || "",
      enabled: cognitoUser.Enabled,
      userStatus: cognitoUser.UserStatus,
      sub: cognitoUser.Attributes ? cognitoUser.Attributes[0].Value : "",
      emailVerified: cognitoUser.Attributes
        ? cognitoUser.Attributes[1].Value === "true"
        : false,
      email: cognitoUser.Attributes ? cognitoUser.Attributes[2].Value : "",
      createdAt: cognitoUser.UserCreateDate
        ? cognitoUser.UserCreateDate
        : new Date(),
      updatedAt: cognitoUser.UserLastModifiedDate
        ? cognitoUser.UserLastModifiedDate
        : new Date(),
    });
  });
});
