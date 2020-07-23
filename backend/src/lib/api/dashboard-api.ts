import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";

const router = Router();

router.get("/", DashboardCtrl.listDashboards);
router.get("/:dashboardId", DashboardCtrl.getDashboardById);
router.post("/", DashboardCtrl.createDashboard);

export default router;
