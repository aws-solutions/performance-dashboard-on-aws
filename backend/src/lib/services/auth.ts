import { Request } from 'express';
import { User } from '../models/user';

const local = !!process.env.BADGER_LOCAL || false;

/**
 * Gets the logged-in user from the http request headers.
 * Returns null if no user is found. 
 * Returns dummy user if running in local mode.
 */
function getCurrentUser(req: Request) : User | null {

  if (local) {
    return userFromClaims(dummyUser());
  }

  /**
   * When running on Lambda behind API Gateway, Cognito user claims
   * are in the x-apigateway-event header inside requestContext.authorizer.
   */
  const event = req.headers['x-apigateway-event'] as string;
  if (!event) {
    throw new Error("Unable to find current user due to missing x-apigateway-event header");
  }
  
  const apigw = JSON.parse(decodeURIComponent(event));
  const requestContext = apigw.requestContext;
  if (!requestContext.authorizer) {
    return null; // No user information found
  }

  const { claims } = requestContext.authorizer;
  return userFromClaims(claims);
}

function userFromClaims(claims: any) : User {
  /**
   * Claims include the standard OIDC claims plus additional ones
   * added by Cognito with the prefix cognito:{attribute}.
   * 
   * https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
   */
  return {
    userId: claims["cognito:username"],
  };
}

function dummyUser(): any {
  return {
    sub: "c077a68a-de21-47c6-a119-9e3449b52edd",
    aud: "1nscgv46llpouam1cvnskjrl42",
    email_verified: "true",
    event_id: "5e28a777-c4c7-43d3-a1cf-d38536728248",
    token_use: "id",
    auth_time: "1595027153",
    iss: "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_JRVEBvlNZ",
    "cognito:username": "fdingler",
    exp: "Sat Jul 18 00:05:53 UTC 2020",
    iat: "Fri Jul 17 23:05:54 UTC 2020",
    email: "fdingler@amazon.com",
  };
}

export default {
  getCurrentUser,
}