import { User } from "../models/user";
import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";

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
    createdAt: cognitoUser.UserCreateDate
      ? cognitoUser.UserCreateDate
      : new Date(),
    updatedAt: cognitoUser.UserLastModifiedDate
      ? cognitoUser.UserLastModifiedDate
      : new Date(),
  };
}

export default {
  fromCognitoUser,
};
