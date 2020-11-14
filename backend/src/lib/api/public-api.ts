import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import HomepageCtrl from "../controllers/homepage-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get(
  "/dashboard/:id",
  withErrorHandler(DashboardCtrl.getPublicDashboardById)
);

router.get("/homepage", withErrorHandler(HomepageCtrl.getHomepage));

export default router;
