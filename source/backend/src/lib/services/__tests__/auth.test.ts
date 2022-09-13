import AuthService from "../auth";
import { Role } from "../../models/user";

let req: any = {};

test("extracts the user roles from the JWT token", () => {
  req.headers = {
    "x-apigateway-event": JSON.stringify({
      requestContext: {
        authorizer: {
          claims: {
            sub: "18df9386",
            aud: "5suh28b1",
            "custom:roles": '["Admin"]',
            email_verified: "true",
            event_id: "bf084059",
            token_use: "id",
            auth_time: "1610562801",
            iss: "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_123",
            "cognito:username": "johndoe",
            exp: "Wed Jan 13 19:33:21 UTC 2021",
            iat: "Wed Jan 13 18:33:21 UTC 2021",
            email: "johndoe@amazon.com",
          },
        },
      },
    }),
  };

  const user = AuthService.getCurrentUser(req);
  expect(user?.userId).toEqual("johndoe");
  expect(user?.roles).toEqual(["Admin"]);
});

test("handles the case of roles not being present in claims", () => {
  req.headers = {
    "x-apigateway-event": JSON.stringify({
      requestContext: {
        authorizer: {
          claims: {
            sub: "18df9386",
            aud: "5suh28b1",
            // "custom:roles": '["Admin"]', // Roles not available
            email_verified: "true",
            event_id: "bf084059",
            token_use: "id",
            auth_time: "1610562801",
            iss: "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_123",
            "cognito:username": "johndoe",
            exp: "Wed Jan 13 19:33:21 UTC 2021",
            iat: "Wed Jan 13 18:33:21 UTC 2021",
            email: "johndoe@amazon.com",
          },
        },
      },
    }),
  };

  const user = AuthService.getCurrentUser(req);
  expect(user?.roles).toEqual([]);
});

test("returns a dummy user when running on local mode", () => {
  process.env.LOCAL_MODE = "true";
  const user = AuthService.getCurrentUser(req);
  expect(user).toEqual({
    roles: [Role.Admin],
    userId: "johndoe",
  });
});
