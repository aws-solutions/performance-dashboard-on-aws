import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import WidgetCtrl from "../controllers/widget-ctrl";
import withErrorHandler from "./middleware/error-handler"

const router = Router();

router.get("/", DashboardCtrl.listDashboards);
router.get("/:id", DashboardCtrl.getDashboardById);
router.post("/", DashboardCtrl.createDashboard);
router.put("/:id", DashboardCtrl.updateDashboard);
router.delete("/:id", DashboardCtrl.deleteDashboard);

router.post("/:id/widget", withErrorHandler(WidgetCtrl.createWidget));

export default router;
