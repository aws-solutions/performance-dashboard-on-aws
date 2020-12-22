import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import HomepageCtrl from "../controllers/homepage-ctrl";
import SettingsCtrl from "../controllers/settings-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get(
  "/dashboard/:id",
  withErrorHandler(DashboardCtrl.getPublicDashboardById)
);

router.get(
  "/dashboard/friendly-url/:friendlyURL",
  withErrorHandler(DashboardCtrl.getPublicDashboardByFriendlyURL)
);

router.get("/homepage", withErrorHandler(HomepageCtrl.getPublicHomepage));
router.get("/settings", withErrorHandler(SettingsCtrl.getPublicSettings));

export default router;
