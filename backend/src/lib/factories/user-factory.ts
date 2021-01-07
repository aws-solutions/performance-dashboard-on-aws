import { User } from "../models/user";
import { UserType } from "aws-sdk/clients/cognitoidentityserviceprovider";

function toUser(cognitoUser: UserType): User {
  return {
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
  };
}

export default {
  toUser,
};
