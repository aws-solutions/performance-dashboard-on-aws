import { Request, Response } from "express";
import AuthService from "../services/auth";
import WidgetFactory from "../factories/widget-factory";
import WidgetRepository from "../repositories/widget-repo";
import DashboardRepository from "../repositories/dashboard-repo";

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
  return res.send(201);
}

export default {
  createWidget,
  deleteWidget,
};
