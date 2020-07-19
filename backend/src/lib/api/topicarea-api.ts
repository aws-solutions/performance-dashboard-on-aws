import { Router } from "express";
import TopicAreaCtrl from '../controllers/topicarea-ctrl';

const router = Router();

router.get("/", TopicAreaCtrl.listTopicAreas);
router.post("/", TopicAreaCtrl.createTopicArea);
router.put("/:id", TopicAreaCtrl.updateTopicArea);
router.delete("/:id", TopicAreaCtrl.deleteTopicArea);

export default router;
