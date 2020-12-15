import { Router } from "express";
import IngestApiCtrl from "../controllers/ingestapi-ctrl";
import withErrorHandler from "./middleware/error-handler";

const router = Router();

router.post("/dataset", withErrorHandler(IngestApiCtrl.createDataset));
router.put("/dataset/:id", withErrorHandler(IngestApiCtrl.updateDataset));
router.delete("/dataset/:id", withErrorHandler(IngestApiCtrl.deleteDataset));

export default router;
