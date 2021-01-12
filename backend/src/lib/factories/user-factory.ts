import { Role, User } from "../models/user";
import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";

function createNew(email: string, role: string): User {
  return {
    userId: email.split("@")[0],
    email,
    roles: [role as Role],
  };
}

function fromCognitoUser(cognitoUser: UserType): User {
  return {
    userId: cognitoUser.Username || "",
    enabled: cognitoUser.Enabled,
    userStatus: cognitoUser.UserStatus,
    sub: cognitoUser.Attributes
      ? cognitoUser.Attributes.find((a) => a.Name === "sub")?.Value
      : "",
    email: cognitoUser.Attributes
      ? cognitoUser.Attributes.find((a) => a.Name === "email")?.Value
      : "",
    roles: cognitoUser.Attributes
      ? JSON.parse(
          cognitoUser.Attributes.find((a) => a.Name === "custom:roles")
            ?.Value || ""
        )
      : [Role.Admin],
    createdAt: cognitoUser.UserCreateDate
      ? cognitoUser.UserCreateDate
      : new Date(),
    updatedAt: cognitoUser.UserLastModifiedDate
      ? cognitoUser.UserLastModifiedDate
      : new Date(),
  };
}

export default {
  createNew,
  fromCognitoUser,
};
