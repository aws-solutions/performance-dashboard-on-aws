import { Request, Response } from "express";
import csp from "../csp";

const req = {} as Request;
const res = {
  set: jest.fn() as any,
} as Response;
const next = jest.fn();

describe("csp", () => {
  it("injects csp headers", () => {
    csp(req, res, next);

    expect(res.set).toHaveBeenCalledWith(
      "Content-Security-Policy",
      "default-src 'self'; block-all-mixed-content;"
    );
    expect(res.set).toHaveBeenCalledWith(
      "Strict-Transport-Security",
      "max-age=31540000; includeSubdomains"
    );
    expect(res.set).toHaveBeenCalledWith("X-XSS-Protection", "1; mode=block");
    expect(res.set).toHaveBeenCalledWith("X-Frame-Options", "DENY");
    expect(res.set).toHaveBeenCalledWith("X-Content-Type-Options", "nosniff");
    expect(res.set).toHaveBeenCalledWith(
      "Cache-control",
      "public, max-age=600"
    );

    expect(next).toHaveBeenCalled();
  });
});
