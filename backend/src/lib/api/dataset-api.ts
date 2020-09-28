import { Router } from "express";
import DatasetCtrl from "../controllers/dataset-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.post("/", withErrorHandler(DatasetCtrl.createDataset));

export default router;
