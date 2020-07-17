import { Router, Request, Response } from "express";
import publicController from "../controllers/public";

const router = Router();

/**
 * GET
 * List dashboards
 */
router.get("/", async (req: Request, res: Response) => {
  const dashboards = await publicController.listDashboards();
  return res.json(dashboards);
});

/**
 * GET
 * Get dashboard by ID
 */
router.get("/:dashboardId", async (req: Request, res: Response) => {
  const { dashboardId } = req.params;
  const dashboards = await publicController.getDashboardById(dashboardId);
  return res.json(dashboards);
});

export default router;
