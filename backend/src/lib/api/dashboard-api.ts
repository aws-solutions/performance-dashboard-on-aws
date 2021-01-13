import { Router } from "express";
import { Role } from "../models/user";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import WidgetCtrl from "../controllers/widget-ctrl";
import errorHandler from "./middleware/error-handler";
import auth from "./middleware/auth";
import rbac from "./middleware/rbac";

const router = Router();
router.use(auth);

router.get(
  "/",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.listDashboards)
);

router.get(
  "/:id",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.getDashboardById)
);

router.get(
  "/:id/versions",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.getVersions)
);

router.post(
  "/:id",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.createNewDraft)
);

router.post(
  "/",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.createDashboard)
);

router.put(
  "/:id/publish",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.publishDashboard)
);

router.put(
  "/:id/publishpending",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.publishPendingDashboard)
);

router.put(
  "/:id/archive",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.archiveDashboard)
);

router.put(
  "/:id/draft",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.moveToDraftDashboard)
);

router.put(
  "/:id/widgetorder",
  rbac(Role.Admin, Role.Editor),
  errorHandler(WidgetCtrl.setWidgetOrder)
);

router.put(
  "/:id",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.updateDashboard)
);

router.delete(
  "/",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.deleteDashboards)
);

router.delete(
  "/:id",
  rbac(Role.Admin, Role.Editor),
  errorHandler(DashboardCtrl.deleteDashboard)
);

router.post(
  "/:id/widget",
  rbac(Role.Admin, Role.Editor),
  errorHandler(WidgetCtrl.createWidget)
);

router.get(
  "/:id/widget/:widgetId",
  rbac(Role.Admin, Role.Editor),
  errorHandler(WidgetCtrl.getWidgetById)
);

router.put(
  "/:id/widget/:widgetId",
  rbac(Role.Admin, Role.Editor),
  errorHandler(WidgetCtrl.updateWidget)
);

router.delete(
  "/:id/widget/:widgetId",
  rbac(Role.Admin, Role.Editor),
  errorHandler(WidgetCtrl.deleteWidget)
);

export default router;
