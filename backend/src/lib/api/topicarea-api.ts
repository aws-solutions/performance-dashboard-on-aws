import { Router } from "express";
import TopicAreaCtrl from "../controllers/topicarea-ctrl";
import withErrorHandler from "./middleware/error-handler";
import auth from "./middleware/auth";

const router = Router();
router.use(auth);

router.get("/", withErrorHandler(TopicAreaCtrl.listTopicAreas));
router.get("/:id", withErrorHandler(TopicAreaCtrl.getTopicAreaById));
router.post("/", withErrorHandler(TopicAreaCtrl.createTopicArea));
router.put("/:id", withErrorHandler(TopicAreaCtrl.updateTopicArea));
router.delete("/:id", withErrorHandler(TopicAreaCtrl.deleteTopicArea));

export default router;
