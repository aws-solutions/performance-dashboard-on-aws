import { Request, Response } from "express";
import factory from "../models/topicarea-factory";
import repo from "../repositories/topicarea-repo";
import authService from "../services/auth";

async function listTopicAreas(req: Request, res: Response) {
  const user = authService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const topicareas = await repo.list();
  res.json(topicareas);
}

async function createTopicArea(req: Request, res: Response) {
  const user = authService.getCurrentUser(req);
  const { name } = req.body;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!name) {
    res.status(400).send("Missing required field `name`");
  }

  const topicarea = factory.createNew(name, user);
  await repo.create(topicarea);
  res.json(topicarea);
}

async function updateTopicArea(req: Request, res: Response) {
  const user = authService.getCurrentUser(req);
  const { id } = req.params;
  const { name } = req.body;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!id || !name) {
    res.status(400).send("Missing required param `id` or body `name`");
    return;
  }

  await repo.updateName(id, name, user);
  res.status(201).send();
}

async function deleteTopicArea(req: Request, res: Response) {
  const user = authService.getCurrentUser(req);
  const { id } = req.params;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!id) {
    res.status(400).send("Missing required param `id`");
    return;
  }

  await repo.remove(id);
  res.status(201).send();
}

export default {
  createTopicArea,
  listTopicAreas,
  updateTopicArea,
  deleteTopicArea,
};
