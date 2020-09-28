import { Router } from "express";
import HomepageCtrl from "../controllers/homepage-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get("/", withErrorHandler(HomepageCtrl.getHomepage));

export default router;
