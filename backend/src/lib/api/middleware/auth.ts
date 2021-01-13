import { Request, Response, NextFunction } from "express";
import AuthService from "../../services/auth";

/**
 * This middleware should only be used in the APIs that require
 * Cognito-based authentication. The Public API and the Data
 * Ingestion API should not use it.
 *
 * Extracts the user from the JWT token included in the request headers
 * and makes it available in the Request object so it can be used in
 * the Controllers. If no user is found, this middleware will reject
 * the request with a 401 Forbidden status code.
 */
const auth = function (req: Request, res: Response, next: NextFunction) {
  const user = AuthService.getCurrentUser(req);
  if (!user) {
    res.status(401);
    return res.send("Unauthorized");
  }

  req.user = user;
  next();
};

export default auth;
