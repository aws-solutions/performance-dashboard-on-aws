/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import { AuditLog } from "../..//models/auditlog";
import AuditLogCtrl from "../auditlog-ctrl";
import AuditLogRepository from "../../repositories/auditlog-repo";

jest.mock("../../repositories/auditlog-repo");

let req: Request;
let res: Response;

beforeEach(() => {
  res = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any as Response;
});

describe("listDashboardAuditLogs", () => {
  it("calls the audit log repository with parentDashboardId and returns logs", async () => {
    req = {
      params: {
        id: "001",
      },
    } as any as Request;

    const auditLogs = [] as AuditLog[];
    AuditLogRepository.listAuditLogs = jest.fn().mockReturnValue(auditLogs);
    await AuditLogCtrl.listDashboardAuditLogs(req, res);

    expect(AuditLogRepository.listAuditLogs).toBeCalledWith("Dashboard#001");
    expect(res.json).toBeCalledWith(auditLogs);
  });
});
