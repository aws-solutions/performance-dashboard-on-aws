import { Request, Response } from "express";
import csp from "../csp";

const req = {} as Request;
const res = {
  setHeader: jest.fn() as any,
} as Response;
const next = jest.fn();

describe("csp", () => {
  it("injects csp headers", () => {
    csp(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Security-Policy",
      "default-src 'self'; block-all-mixed-content;"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Strict-Transport-Security",
      "max-age=31540000; includeSubdomains"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "X-XSS-Protection",
      "1; mode=block"
    );
    expect(res.setHeader).toHaveBeenCalledWith("X-Frame-Options", "DENY");
    expect(res.setHeader).toHaveBeenCalledWith(
      "X-Content-Type-Options",
      "nosniff"
    );

    expect(next).toHaveBeenCalled();
  });
});
