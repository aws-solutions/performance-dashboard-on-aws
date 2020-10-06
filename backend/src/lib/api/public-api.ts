import { Router } from "express";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get(
  "/dashboard/:id",
  withErrorHandler(DashboardCtrl.getPublicDashboardById)
);

export default router;
