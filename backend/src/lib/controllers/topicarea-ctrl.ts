import { Request, Response } from "express";
import TopicAreaFactory from "../factories/topicarea-factory";
import AuthService from "../services/auth";
import TopicAreaRepository from "../repositories/topicarea-repo";

async function listTopicAreas(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const repo = TopicAreaRepository.getInstance();
  const topicareas = await repo.list();
  res.json(topicareas);
}

async function createTopicArea(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  const { name } = req.body;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!name) {
    res.status(400).send("Missing required field `name`");
    return;
  }

  const topicarea = TopicAreaFactory.createNew(name, user);

  const repo = TopicAreaRepository.getInstance();
  await repo.create(topicarea);
  res.json(topicarea);
}

async function getTopicAreaById(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).send("Missing required field `id`");
    return;
  }

  const repo = TopicAreaRepository.getInstance();
  const topicArea = await repo.getTopicAreaById(id);
  res.json(topicArea);
}

async function updateTopicArea(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
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

  const topicArea = TopicAreaFactory.create(id, name, user);

  const repo = TopicAreaRepository.getInstance();
  await repo.updateTopicArea(topicArea, user);
  res.send();
}

async function deleteTopicArea(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  const { id } = req.params;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!id) {
    res.status(400).send("Missing required param `id`");
    return;
  }

  const repo = TopicAreaRepository.getInstance();
  await repo.delete(id);
  res.send();
}

export default {
  createTopicArea,
  listTopicAreas,
  getTopicAreaById,
  updateTopicArea,
  deleteTopicArea,
};
