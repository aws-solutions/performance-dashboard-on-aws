import { Request, Response } from "express";
import AuthService from "../services/auth";
import WidgetFactory from "../factories/widget-factory";
import WidgetRepository from "../repositories/widget-repo";

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

  const widget = WidgetFactory.createWidget(
    name,
    dashboardId,
    widgetType,
    content
  );

  const repo = WidgetRepository.getInstance();
  await repo.saveWidget(widget);
  return res.json(widget);
}

export default {
  createWidget,
};
