import { Router, Request, Response } from "express";
import adminController from "../controllers/admin";

const router = Router();

/**
 * POST
 * Create a new topic area
 */
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send("Missing required field `name`");
    return;
  }

  const createRes = await adminController.createTopicArea({ name });
  return res.json(createRes);
});

export default router;
