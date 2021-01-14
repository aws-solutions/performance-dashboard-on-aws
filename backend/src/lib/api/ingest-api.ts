import { Router } from "express";
import IngestApiCtrl from "../controllers/ingestapi-ctrl";
import errorHandler from "./middleware/error-handler";

const router = Router();

router.post("/dataset", errorHandler(IngestApiCtrl.createDataset));
router.put("/dataset/:id", errorHandler(IngestApiCtrl.updateDataset));
router.delete("/dataset/:id", errorHandler(IngestApiCtrl.deleteDataset));

export default router;
