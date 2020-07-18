import { Router, Request, Response } from "express";
import controller from "../controllers/topicarea";
import authService from "../services/auth";

const router = Router();

/**
 * GET
 * List topic areas
 */
router.get("/", async (req: Request, res: Response) => {
  return res.json([]);
});

/**
 * POST
 * Create a new topic area
 */
router.post("/", async (req: Request, res: Response) => {
  
  const { name } = req.body;
  const user = authService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!name) {
    res.status(400).send("Missing required field `name`");
    return;
  }

  try {
    const createRes = await controller.createTopicArea({ name });
    return res.json(createRes);
  } catch (err) {
    console.error('Error creating topic area', err);
    res.status(500).send("Internal server error");
  }
});

export default router;
