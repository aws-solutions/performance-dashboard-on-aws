import { Request, Response } from "express";
import DashboardFactory from "../factories/dashboard-factory";
import AuditLogRepository from "../repositories/auditlog-repo";
import logger from "../services/logger";

async function listDashboardAuditLogs(req: Request, res: Response) {
  const parentDashboardId = req.params.id;

  logger.info("Listing audit logs for dashboard family %s", parentDashboardId);
  const primaryKey = DashboardFactory.itemId(parentDashboardId);
  const auditLogs = await AuditLogRepository.listAuditLogs(primaryKey);

  logger.debug("Fetched audit logs %o", auditLogs);
  return res.json(auditLogs);
}

export default {
  listDashboardAuditLogs,
};
