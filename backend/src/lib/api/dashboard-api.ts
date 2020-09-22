import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import WidgetCtrl from "../controllers/widget-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get("/", withErrorHandler(DashboardCtrl.listDashboards));
router.get("/:id", withErrorHandler(DashboardCtrl.getDashboardById));
router.post("/", withErrorHandler(DashboardCtrl.createDashboard));
router.put("/:id/widgetorder", withErrorHandler(WidgetCtrl.setWidgetOrder));
router.put("/:id", withErrorHandler(DashboardCtrl.updateDashboard));
router.delete("/:id", withErrorHandler(DashboardCtrl.deleteDashboard));

router.post("/:id/widget", withErrorHandler(WidgetCtrl.createWidget));
router.get("/:id/widget/:widgetId", withErrorHandler(WidgetCtrl.getWidgetById));
router.put("/:id/widget/:widgetId", withErrorHandler(WidgetCtrl.updateWidget));
router.delete(
  "/:id/widget/:widgetId",
  withErrorHandler(WidgetCtrl.deleteWidget)
);

export default router;
