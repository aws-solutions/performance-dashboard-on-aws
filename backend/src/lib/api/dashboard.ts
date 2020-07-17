import { Router, Request, Response } from "express";
import dashboardController from "../controllers/dashboard";

const router = Router();

/**
 * GET
 * List dashboards
 */
router.get("/", async (req: Request, res: Response) => {
  const dashboards = await dashboardController.listDashboards();
  return res.json(dashboards);
});

/**
 * GET
 * Get dashboard by ID
 */
router.get("/:dashboardId", async (req: Request, res: Response) => {
  const { dashboardId } = req.params;
  const dashboards = await dashboardController.getDashboardById(dashboardId);
  return res.json(dashboards);
});

export default router;
