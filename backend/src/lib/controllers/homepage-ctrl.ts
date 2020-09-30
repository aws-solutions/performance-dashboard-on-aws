import { Request, Response } from "express";
import HomepageFactory from "../factories/homepage-factory";
import HomepageRepository from "../repositories/homepage-repo";
import DashboardRepository from "../repositories/dashboard-repo";
import DashboardFactory from "../factories/dashboard-factory";

async function getHomepage(req: Request, res: Response) {
  const repo = HomepageRepository.getInstance();
  const dashboardRepo = DashboardRepository.getInstance();

  let homepage = await repo.getHomepage();
  const dashboards = await dashboardRepo.listPublishedDashboards();
  const publicDashboards = dashboards.map(DashboardFactory.toPublic);

  if (!homepage) {
    homepage = HomepageFactory.getDefaultHomepage();
  }

  return res.json({
    ...homepage,
    dashboards: publicDashboards,
  });
}

export default {
  getHomepage,
};
