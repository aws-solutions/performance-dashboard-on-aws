import { Router } from "express";
import SettingsCtrl from "../controllers/settings-ctrl";
import withErrorHandler from "./middleware/error-handler";
import HomepageCtrl from "../controllers/homepage-ctrl";

const router = Router();

router.get("/", withErrorHandler(SettingsCtrl.getSettings));
router.put("/", withErrorHandler(SettingsCtrl.updateSettings));
router.put("/homepage", withErrorHandler(HomepageCtrl.updateHomepage));

export default router;
