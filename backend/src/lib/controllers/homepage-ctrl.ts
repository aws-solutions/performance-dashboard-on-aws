import { Request, Response } from "express";
import HomepageFactory from "../factories/homepage-factory";
import HomepageRepository from "../repositories/homepage-repo";
import DashboardRepository from "../repositories/dashboard-repo";
import DashboardFactory from "../factories/dashboard-factory";
import { Dashboard } from "../models/dashboard";

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
  const user = req.user;
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

// A helper function that splits a paragraph into sentences,
// then returns an array of sentences that contain a queried string.
function splitAndSearch(paragraph: string, query: string) {
  let matches: Array<string> = [];
  let sentences = paragraph.replace(/([.?!:])\s*(?=[A-Z])/g, "$1|").split("|");
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(query)) {
      matches.push(sentence);
    }
  }
  return matches;
}

/**
 * Get a list of matches of a query in a Dashboard.
 * @param query string
 * @param dashboard Dashboard
 * @returns string[] of matches
 */
function getDashboardQueryMatches(
  query: string,
  dashboard: Dashboard
): string[] {
  const queryMatches: string[] = [];
  if (dashboard.name.toLowerCase().includes(query)) {
    queryMatches.push(dashboard.name);
  }

  if (dashboard.description.toLowerCase().includes(query)) {
    queryMatches.push(dashboard.description);
  }

  if (!dashboard.widgets) {
    return queryMatches;
  }

  for (const widget of dashboard.widgets) {
    if (widget.content.text) {
      const matches = splitAndSearch(widget.content.text, query);
      if (matches.length) {
        queryMatches.push(...matches);
      }
    }

    if (widget.content.title) {
      const matches = splitAndSearch(widget.content.title, query);
      if (matches.length) {
        queryMatches.push(...matches);
      }
    }

    if (widget.content.summary) {
      const matches = splitAndSearch(widget.content.summary, query);
      if (matches.length) {
        queryMatches.push(...matches);
      }
    }
  }

  return queryMatches;
}

// Returns homepage title, description and a list of dashboards
// with content that matches a search query.
async function getPublicHomepageWithQuery(req: Request, res: Response) {
  const { q } = req.query;
  if (!q) {
    return getHomepage(req, res);
  }
  const query = (q as string).toLowerCase().trim();

  const repo = HomepageRepository.getInstance();
  let homepage = await repo.getHomepage();
  if (!homepage) {
    homepage = HomepageFactory.getDefaultHomepage();
  }

  const dashboardRepo = DashboardRepository.getInstance();
  const dashboards = await dashboardRepo.listPublishedDashboards();
  let publicDashboards = dashboards.map(DashboardFactory.toPublic);

  if (publicDashboards) {
    let index = publicDashboards.length;

    while (index--) {
      let dashboard = publicDashboards[index];

      const dashboardWithWidgets = await dashboardRepo.getDashboardWithWidgets(
        dashboard.id
      );

      dashboard.queryMatches = getDashboardQueryMatches(
        query,
        dashboardWithWidgets
      );

      if (dashboard.queryMatches.length === 0) {
        publicDashboards.splice(index, 1);
      }
    }
  }

  return res.json({
    title: homepage.title,
    description: homepage.description,
    dashboards: publicDashboards,
  });
}

export default {
  getPublicHomepage,
  getHomepage,
  updateHomepage,
  getPublicHomepageWithQuery,
};
