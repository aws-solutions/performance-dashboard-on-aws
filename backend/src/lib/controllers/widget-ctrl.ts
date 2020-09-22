import { Request, Response } from "express";
import AuthService from "../services/auth";
import WidgetFactory from "../factories/widget-factory";
import WidgetRepository from "../repositories/widget-repo";
import DashboardRepository from "../repositories/dashboard-repo";

async function getWidgetById(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { id, widgetId } = req.params;

  if (!id) {
    res.status(400).send("Missing required field `id`");
  }

  if (!widgetId) {
    res.status(400).send("Missing required field `widgetId`");
  }

  const repo = WidgetRepository.getInstance();
  const widget = await repo.getWidgetById(id, widgetId);
  res.json(widget);
}

async function createWidget(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dashboardId = req.params.id;
  if (!dashboardId) {
    res.status(400).send("Missing required field `id`");
  }

  const { name, content, widgetType } = req.body;

  if (!name) {
    res.status(400).send("Missing required field `name`");
  }

  if (!content) {
    res.status(400).send("Missing required field `content`");
  }

  if (!widgetType) {
    res.status(400).send("Missing required field `widgetType`");
  }

  let widget;
  try {
    widget = WidgetFactory.createWidget(name, dashboardId, widgetType, content);
  } catch (err) {
    console.log("Invalid request to create widget", err);
    return res.status(400).send(err.message);
  }

  const repo = WidgetRepository.getInstance();
  const dashboardRepo = DashboardRepository.getInstance();

  await repo.saveWidget(widget);
  await dashboardRepo.updateAt(dashboardId, new Date(), user);

  return res.json(widget);
}

async function updateWidget(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dashboardId = req.params.id;
  if (!dashboardId) {
    res.status(400).send("Missing required field `id`");
  }

  const widgetId = req.params.widgetId;
  if (!widgetId) {
    res.status(400).send("Missing required field `widgetId`");
  }

  const { name, content, widgetType } = req.body;

  if (!name) {
    res.status(400).send("Missing required field `name`");
  }

  if (!content) {
    res.status(400).send("Missing required field `content`");
  }

  if (!widgetType) {
    res.status(400).send("Missing required field `widgetType`");
  }

  let widget;
  try {
    widget = WidgetFactory.createWidget(
      name,
      dashboardId,
      widgetType,
      content,
      widgetId
    );
  } catch (err) {
    console.log("Invalid request to create widget", err);
    return res.status(400).send(err.message);
  }

  const repo = WidgetRepository.getInstance();
  const dashboardRepo = DashboardRepository.getInstance();
  await repo.updateWidget(widget);
  await dashboardRepo.updateAt(dashboardId, new Date(), user);
  return res.json(widget);
}

async function deleteWidget(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dashboardId = req.params.id;
  const widgetId = req.params.widgetId;

  if (!dashboardId) {
    res.status(400);
    return res.send("Missing required path param `id`");
  }

  if (!widgetId) {
    res.status(400);
    return res.send("Missing required path param `widgetId`");
  }

  const repo = WidgetRepository.getInstance();
  await repo.deleteWidget(dashboardId, widgetId);
  return res.send();
}

async function setWidgetOrder(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dashboardId = req.params.id;
  const { widgets } = req.body;

  if (!dashboardId) {
    res.status(400);
    return res.send("Missing required path param `id`");
  }

  if (!widgets) {
    res.status(400);
    return res.send("Missing required field `widgets`");
  }

  try {
    const repo = WidgetRepository.getInstance();
    await repo.setWidgetOrder(dashboardId, widgets);
    return res.send();
  } catch (err) {
    console.log("Failed to set widget order", err);
    res.status(409);
    return res.send("Unable to reorder widgets, please refetch them and retry");
  }
}

export default {
  getWidgetById,
  createWidget,
  updateWidget,
  deleteWidget,
  setWidgetOrder,
};
