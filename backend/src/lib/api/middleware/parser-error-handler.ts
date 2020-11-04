import { Request, Response, NextFunction } from "express";

/**
 * Catch parser error
 */
const parserError = function (
  err: Error | null,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError && err.message.indexOf("JSON") !== -1) {
    res.status(400);
    res.send("Bad JSON");
  } else {
    next();
  }
};

export default parserError;
