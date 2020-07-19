import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";

const router = Router();

router.get("/", DashboardCtrl.listDashboards);
router.get("/:dashboardId", DashboardCtrl.getDashboardById);

export default router;
