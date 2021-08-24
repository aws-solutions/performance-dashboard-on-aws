import { Request, Response } from "express";
import { ItemNotFound } from "../errors";
import { Dashboard, DashboardState } from "../models/dashboard";
import FriendlyUrlService from "../services/friendlyurl-service";
import DashboardFactory from "../factories/dashboard-factory";
import DashboardRepository from "../repositories/dashboard-repo";
import TopicAreaRepository from "../repositories/topicarea-repo";

async function listDashboards(req: Request, res: Response) {
  const repo = DashboardRepository.getInstance();
  const dashboards = await repo.listDashboards();
  res.json(dashboards);
}

async function createDashboard(req: Request, res: Response) {
  const user = req.user;
  const { topicAreaId, name, description } = req.body;

  if (!topicAreaId) {
    res.status(400).send("Missing required field `topicAreaId`");
    return;
  }

  if (!name) {
    res.status(400).send("Missing required field `name`");
    return;
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
  const { id } = req.params;
  const repo = DashboardRepository.getInstance();

  try {
    const dashboard = await repo.getDashboardWithWidgets(id);
    return res.json(dashboard);
  } catch (err) {
    if (err instanceof ItemNotFound) {
      res.status(404);
      return res.send("Dashboard not found");
    }
    throw err;
  }
}

async function getPublicDashboardByFriendlyURL(req: Request, res: Response) {
  const { friendlyURL } = req.params;

  const repo = DashboardRepository.getInstance();
  let dashboard: Dashboard;

  try {
    dashboard = await repo.getDashboardByFriendlyURL(friendlyURL);
  } catch (err) {
    if (err instanceof ItemNotFound) {
      res.status(404);
      return res.send("Dashboard not found");
    }
    throw err;
  }

  if (dashboard.state !== DashboardState.Published) {
    res.status(404);
    return res.send("Dashboard not found");
  }

  // Now we need to get the widgets as well
  dashboard = await repo.getDashboardWithWidgets(dashboard.id);
  const publicDashboard = DashboardFactory.toPublic(dashboard);

  return res.json(publicDashboard);
}

async function getPublicDashboardById(req: Request, res: Response) {
  const { id } = req.params;

  const repo = DashboardRepository.getInstance();
  let dashboard: Dashboard;

  try {
    dashboard = await repo.getDashboardWithWidgets(id);
  } catch (err) {
    if (err instanceof ItemNotFound) {
      res.status(404);
      return res.send("Dashboard not found");
    }
    throw err;
  }

  if (dashboard.state !== DashboardState.Published) {
    res.status(404);
    return res.send("Dashboard not found");
  }

  const publicDashboard = DashboardFactory.toPublic(dashboard);
  return res.json(publicDashboard);
}

async function getVersions(req: Request, res: Response) {
  const { id } = req.params;
  const repo = DashboardRepository.getInstance();

  try {
    const dashboardVersions = await repo.getDashboardVersions(id);
    const versions = dashboardVersions.map(DashboardFactory.toVersion);
    return res.json(versions);
  } catch (err) {
    if (err instanceof ItemNotFound) {
      res.status(404);
      return res.send("Dashboard versions not found");
    }
    throw err;
  }
}

async function updateDashboard(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  const { name, topicAreaId, displayTableOfContents, description, updatedAt } =
    req.body;

  if (!name) {
    res.status(400).send("Missing required body `name`");
    return;
  }

  if (!topicAreaId) {
    res.status(400).send("Missing required body `topicAreaId`");
    return;
  }

  if (!updatedAt) {
    res.status(400).send("Missing required body `updatedAt`");
    return;
  }

  let topicArea;

  try {
    topicArea = await TopicAreaRepository.getInstance().getTopicAreaById(
      topicAreaId
    );
  } catch (error) {
    if (error instanceof ItemNotFound) {
      res.status(400).send("Invalid `topicAreaId`");
      return;
    } else throw error;
  }

  const repo = DashboardRepository.getInstance();
  await repo.updateDashboard(
    id,
    name,
    topicAreaId,
    topicArea.name,
    displayTableOfContents,
    description,
    updatedAt,
    user
  );
  res.send();
}

async function publishDashboard(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  const { updatedAt, releaseNotes } = req.body;
  let { friendlyURL } = req.body;

  if (!updatedAt) {
    res.status(400).send("Missing required body `updatedAt`");
    return;
  }

  const repo = DashboardRepository.getInstance();
  const dashboard = await repo.getDashboardById(id);

  if (
    dashboard.state !== DashboardState.PublishPending &&
    dashboard.state !== DashboardState.Archived
  ) {
    res.status(409);
    return res.send("Dashboard must be in publish pending or archived state");
  }

  try {
    friendlyURL = await FriendlyUrlService.generateOrValidate(
      dashboard,
      friendlyURL
    );
  } catch (err) {
    res.status(409);
    return res.send(err.message);
  }

  await repo.publishDashboard(
    id,
    dashboard.parentDashboardId,
    updatedAt,
    releaseNotes || "",
    user,
    friendlyURL
  );

  return res.send();
}

async function publishPendingDashboard(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  const { updatedAt, releaseNotes } = req.body;

  if (!updatedAt) {
    res.status(400).send("Missing required body `updatedAt`");
    return;
  }

  const repo = DashboardRepository.getInstance();
  const dashboard = await repo.getDashboardById(id);
  if (
    dashboard.state !== DashboardState.Draft &&
    dashboard.state !== DashboardState.PublishPending
  ) {
    res.status(409);
    return res.send("Dashboard must be in draft or publish pending state");
  }

  const updatedDashboard = await repo.publishPendingDashboard(
    id,
    updatedAt,
    user,
    releaseNotes
  );

  res.json(updatedDashboard);
}

async function archiveDashboard(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  const { updatedAt } = req.body;

  if (!updatedAt) {
    res.status(400).send("Missing required body `updatedAt`");
    return;
  }

  const repo = DashboardRepository.getInstance();

  const dashboard = await repo.getDashboardById(id);
  if (dashboard.state !== DashboardState.Published) {
    res.status(409);
    return res.send("Dashboard must be in published state");
  }

  await repo.archiveDashboard(id, updatedAt, user);
  res.send();
}

async function moveToDraftDashboard(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  const { updatedAt } = req.body;

  if (!updatedAt) {
    res.status(400).send("Missing required body `updatedAt`");
    return;
  }

  const repo = DashboardRepository.getInstance();

  const dashboard = await repo.getDashboardById(id);
  if (dashboard.state !== DashboardState.PublishPending) {
    res.status(409);
    return res.send("Dashboard must be in publish pending state");
  }

  await repo.moveToDraft(id, updatedAt, user);
  res.send();
}

async function deleteDashboard(req: Request, res: Response) {
  const { id } = req.params;

  const repo = DashboardRepository.getInstance();
  await repo.delete(id);
  return res.send();
}

async function deleteDashboards(req: Request, res: Response) {
  const user = req.user;
  const { ids } = req.query;

  if (!ids) {
    res.status(400).send("Missing required query `ids`");
    return;
  }

  const dashboardIds = (ids as string).split(",");

  const repo = DashboardRepository.getInstance();
  await repo.deleteDashboardsAndWidgets(dashboardIds, user);
  return res.send();
}

async function createNewDraft(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;
  const repo = DashboardRepository.getInstance();

  const dashboard = await repo.getDashboardWithWidgets(id);
  if (dashboard.state !== DashboardState.Published) {
    res.status(409);
    return res.send("Dashboard must be Published to create a new draft");
  }

  const existingDraft = await repo.getCurrentDraft(dashboard.parentDashboardId);
  if (existingDraft) {
    return res.json(existingDraft);
  }

  const version = await repo.getNextVersionNumber(dashboard.parentDashboardId);
  const draft = DashboardFactory.createDraftFromDashboard(
    dashboard,
    user,
    version
  );

  await repo.saveDashboardAndWidgets(draft);
  return res.json(draft);
}

export default {
  listDashboards,
  createDashboard,
  getDashboardById,
  getPublicDashboardByFriendlyURL,
  getVersions,
  updateDashboard,
  publishDashboard,
  publishPendingDashboard,
  archiveDashboard,
  moveToDraftDashboard,
  deleteDashboard,
  deleteDashboards,
  getPublicDashboardById,
  createNewDraft,
};
