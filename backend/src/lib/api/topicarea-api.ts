import { Router } from "express";
import TopicAreaCtrl from '../controllers/topicarea-ctrl';

const router = Router();

router.get("/", TopicAreaCtrl.listTopicAreas);
router.get("/:id", TopicAreaCtrl.getTopicAreaById);
router.post("/", TopicAreaCtrl.createTopicArea);
router.put("/:id", TopicAreaCtrl.updateTopicArea);
router.delete("/:id", TopicAreaCtrl.deleteTopicArea);

export default router;
