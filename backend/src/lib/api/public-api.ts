import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import HomepageCtrl from "../controllers/homepage-ctrl";
import SettingsCtrl from "../controllers/settings-ctrl";
import errorHandler from "./middleware/error-handler";

const router = Router();

router.get(
  "/dashboard/:id",
  errorHandler(DashboardCtrl.getPublicDashboardById)
);

router.get(
  "/dashboard/friendly-url/:friendlyURL",
  errorHandler(DashboardCtrl.getPublicDashboardByFriendlyURL)
);

router.get(
  "/search",
  errorHandler(HomepageCtrl.getPublicHomepageWithQuery)
);

router.get("/homepage", errorHandler(HomepageCtrl.getPublicHomepage));
router.get("/settings", errorHandler(SettingsCtrl.getPublicSettings));

export default router;
