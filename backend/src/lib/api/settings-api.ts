import { Router } from "express";
import SettingsCtrl from "../controllers/settings-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get("/", withErrorHandler(SettingsCtrl.getSettings));
router.put("/", withErrorHandler(SettingsCtrl.updateSettings));

export default router;
