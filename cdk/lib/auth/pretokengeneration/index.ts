import AWS = require("aws-sdk");
import { ListUsersRequest } from "aws-sdk/clients/cognitoidentityserviceprovider";

export const handler = async (event: any) => {
  // email of user who just signed in
  const email = event.request.userAttributes["email"];

  if (!email || !process.env.USER_POOL_ID) {
    return event;
  }

  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  // search in Cognito for user with that email
  var params: ListUsersRequest = {
    UserPoolId: process.env.USER_POOL_ID,
    Filter: `email=\"${email}\"`,
  };
  // may get back multiple as Cognito will create a copy of a user the IdP
  var users = await cognitoidentityserviceprovider.listUsers(params).promise();

  var roles: string = '[""]';

  if (users && Array.isArray(users["Users"])) {
    // filter out copy of user in IdP
    var user = users["Users"].filter(
      (attr) => attr["UserStatus"] != "EXTERNAL_PROVIDER"
    );

    if (user.length == 1 && Array.isArray(user[0]["Attributes"])) {
      // filter out everything but the roles attribute
      var roleAttribute = user[0]["Attributes"].filter(
        (attr) => attr["Name"] == "custom:roles"
      );
      if (roleAttribute.length == 1 && roleAttribute[0]["Value"])
        roles = roleAttribute[0]["Value"];
    }
  }

  // override the claim with the roles in Cognito for the user who's signing in
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        "custom:roles": roles,
      },
    },
  };
  console.log(event.response);

  return event;
};
