import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";

const router = Router();

router.get("/", DashboardCtrl.listDashboards);
router.get("/:id", DashboardCtrl.getDashboardById);
router.post("/", DashboardCtrl.createDashboard);
router.put("/:id", DashboardCtrl.updateDashboard);
router.delete("/:id", DashboardCtrl.deleteDashboard);

export default router;
