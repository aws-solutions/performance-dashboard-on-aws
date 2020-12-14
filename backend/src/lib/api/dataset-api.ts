import { Router } from "express";
import DatasetCtrl from "../controllers/dataset-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.get("/", withErrorHandler(DatasetCtrl.listDatasets));
router.get("/:id", withErrorHandler(DatasetCtrl.getDatasetById));
router.post("/", withErrorHandler(DatasetCtrl.createDataset));

export default router;
