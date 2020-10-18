import { Request, Response, NextFunction } from "express";

/**
 * Inject security related HTTP headers into the responses
 */
const csp = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; block-all-mixed-content;"
  );
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31540000; includeSubdomains"
  );
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
};

export default csp;
