import { Request, Response } from "express";
import DashboardFactory from "../factories/dashboard-factory";
import AuthService from "../services/auth";
import DashboardRepository from "../repositories/dashboard-repo";
import TopicAreaRepository from "../repositories/topicarea-repo";

async function listDashboards(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const repo = DashboardRepository.getInstance();
  const dashboards = await repo.listDashboards();
  res.json(dashboards);
}

async function createDashboard(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { topicAreaId, name, description } = req.body;

  if (!topicAreaId) {
    res.status(400).send("Missing required field `topicAreaId`");
  }

  if (!name) {
    res.status(400).send("Missing required field `name`");
  }

  const topicArea = await TopicAreaRepository.getInstance().getTopicAreaById(
    topicAreaId
  );
  const dashboard = DashboardFactory.createNew(
    name,
    topicAreaId,
    topicArea.name,
    description,
    user
  );

  const repo = DashboardRepository.getInstance();
  await repo.putDashboard(dashboard);
  res.json(dashboard);
}

async function getDashboardById(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).send("Missing required field `id`");
  }

  const repo = DashboardRepository.getInstance();
  const dashboard = await repo.getDashboardWithWidgets(id);
  res.json(dashboard);
}

async function updateDashboard(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).send("Missing required field `id`");
  }

  const { name, topicAreaId, description } = req.body;

  if (!name) {
    res.status(400).send("Missing required body `name`");
    return;
  }

  if (!topicAreaId) {
    res.status(400).send("Missing required body `topicAreaId`");
    return;
  }

  const topicArea = await TopicAreaRepository.getInstance().getTopicAreaById(
    topicAreaId
  );
  const dashboard = DashboardFactory.create(
    id,
    name,
    topicAreaId,
    topicArea.name,
    description,
    user
  );

  const repo = DashboardRepository.getInstance();
  await repo.updateDashboard(dashboard, user);
  res.status(201).send();
}

async function deleteDashboard(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).send("Missing required field `id`");
  }

  const repo = DashboardRepository.getInstance();
  await repo.delete(id);
  res.status(201).send();
}

export default {
  listDashboards,
  createDashboard,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
};
