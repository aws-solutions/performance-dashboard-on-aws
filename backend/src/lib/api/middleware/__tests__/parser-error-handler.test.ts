/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import parserError from "../parser-error-handler";

const req = {} as Request;
const res = {
  status: jest.fn() as any,
  send: jest.fn() as any,
} as Response;
const next = jest.fn();
const noError = null;
const parseError = new SyntaxError("JSON parser failed");

afterEach(() => {
  jest.clearAllMocks();
});

describe("parser-error", () => {
  it("catches parser exception", () => {
    parserError(parseError, req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Bad JSON");
    expect(next).not.toBeCalled();
  });

  it("propagates successful parse", () => {
    parserError(noError, req, res, next);

    expect(next).toBeCalled();
    expect(res.status).not.toBeCalled();
    expect(res.send).not.toBeCalled();
  });
});
