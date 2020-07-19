import { Router } from "express";
import ctrl from '../controllers/topicarea-ctrl';

const router = Router();

router.get("/", ctrl.listTopicAreas);
router.post("/", ctrl.createTopicArea);
router.put("/:id", ctrl.updateTopicArea);
router.delete("/:id", ctrl.deleteTopicArea);

export default router;
