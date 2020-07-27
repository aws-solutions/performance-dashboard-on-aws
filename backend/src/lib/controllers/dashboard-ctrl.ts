import { Request, Response } from "express";
import DashboardFactory from "../models/dashboard-factory";
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

    if (!description) {
        res.status(400).send("Missing required field `description`");
    }

    const topicArea = await TopicAreaRepository.getInstance().getTopicAreaById(topicAreaId);
    const dashboard = DashboardFactory.createNew(name, topicAreaId, topicArea.name, description, user);

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

    const { topicAreaId, dashboardId} = req.params;

    if (!topicAreaId) {
        res.status(400).send("Missing required field `topicAreaId`");
    }

    if (!dashboardId) {
        res.status(400).send("Missing required field `dashboardId`");
    }

    const repo = DashboardRepository.getInstance();
    const dashboard = await repo.getDashboardById(dashboardId, topicAreaId);
    res.json(dashboard);
}

async function updateDashboard(req: Request, res: Response) {
    const user = AuthService.getCurrentUser(req);
  
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
  
    const { topicAreaId, dashboardId} = req.params;

    if (!topicAreaId) {
        res.status(400).send("Missing required field `topicAreaId`");
    }

    if (!dashboardId) {
        res.status(400).send("Missing required field `dashboardId`");
    }

    const { overview } = req.body; 

    if (!overview) {
      res.status(400).send("Missing required body `overview`");
      return;
    }
  
    const repo = DashboardRepository.getInstance();
    await repo.updateOverview(dashboardId, topicAreaId, overview, user);
    res.status(201).send();
  }
  
  async function deleteDashboard(req: Request, res: Response) {
    const user = AuthService.getCurrentUser(req);
  
    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }
  
    const { topicAreaId, dashboardId} = req.params;

    if (!topicAreaId) {
        res.status(400).send("Missing required field `topicAreaId`");
    }

    if (!dashboardId) {
        res.status(400).send("Missing required field `dashboardId`");
    }
  
    const repo = DashboardRepository.getInstance();
    await repo.delete(dashboardId, topicAreaId);
    res.status(201).send();
  }

export default {
    listDashboards,
    createDashboard,
    getDashboardById,
    updateDashboard,
    deleteDashboard,
}