import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";

const router = Router();

router.get("/", DashboardCtrl.listDashboards);
router.get("/:topicAreaId/:dashboardId", DashboardCtrl.getDashboardById);
router.post("/", DashboardCtrl.createDashboard);
router.put("/:topicAreaId/:dashboardId", DashboardCtrl.updateDashboard);
router.delete("/:topicAreaId/:dashboardId", DashboardCtrl.deleteDashboard);

export default router;
