import { Request, Response } from "express";
import HomepageFactory from "../factories/homepage-factory";
import HomepageRepository from "../repositories/homepage-repo";
import DashboardRepository from "../repositories/dashboard-repo";
import DashboardFactory from "../factories/dashboard-factory";
import AuthService from "../services/auth";

async function getPublicHomepage(req: Request, res: Response) {
  const repo = HomepageRepository.getInstance();
  const dashboardRepo = DashboardRepository.getInstance();

  let homepage = await repo.getHomepage();
  const dashboards = await dashboardRepo.listPublishedDashboards();
  const publicDashboards = dashboards.map(DashboardFactory.toPublic);

  if (!homepage) {
    homepage = HomepageFactory.getDefaultHomepage();
  }

  return res.json({
    title: homepage.title,
    description: homepage.description,
    dashboards: publicDashboards,
  });
}

async function getHomepage(req: Request, res: Response) {
  const repo = HomepageRepository.getInstance();

  let homepage = await repo.getHomepage();

  if (!homepage) {
    homepage = HomepageFactory.getDefaultHomepage();
  }

  return res.json(homepage);
}

async function updateHomepage(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { title, description, updatedAt } = req.body;

  if (!title) {
    res.status(400).send("Missing required body `title`");
    return;
  }

  if (!description) {
    res.status(400).send("Missing required body `description`");
    return;
  }

  if (!updatedAt) {
    res.status(400).send("Missing required body `updatedAt`");
    return;
  }

  const repo = HomepageRepository.getInstance();
  await repo.updateHomepage(title, description, updatedAt, user);

  res.send();
}

export default {
  getPublicHomepage,
  getHomepage,
  updateHomepage,
};
