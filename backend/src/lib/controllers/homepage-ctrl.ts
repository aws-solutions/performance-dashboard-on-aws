import { Request, Response } from "express";
import HomepageFactory from "../factories/homepage-factory";
import HomepageRepository from "../repositories/homepage-repo";
import DashboardRepository from "../repositories/dashboard-repo";
import DashboardFactory from "../factories/dashboard-factory";
import DashboardCtrl from "../controllers/dashboard-ctrl";
import AuthService from "../services/auth";
import { RSA_NO_PADDING } from "constants";
import { setUncaughtExceptionCaptureCallback } from "process";
import { convertCompilerOptionsFromJson } from "typescript";

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
  for (var sentence of sentences) {
    if (sentence.toLowerCase().includes(query)) {
      matches.push(sentence);
    }
  }
  return matches;
}

// Returns homepage title, description and a list of dashboards
// with content that matches a search query.
async function getPublicHomepageWithQuery(req: Request, res: Response) {
  let { query } = req.params;
  query = query.toLowerCase();

  const repo = HomepageRepository.getInstance();
  let homepage = await repo.getHomepage();
  if (!homepage) {
    homepage = HomepageFactory.getDefaultHomepage();
  }

  const dashboardRepo = DashboardRepository.getInstance();
  const dashboards = await dashboardRepo.listPublishedDashboards();
  let publicDashboards = dashboards.map(DashboardFactory.toPublic);

  if (publicDashboards) {
    var index = publicDashboards.length;

    while (index--) {
      let found = false;
      let dashboard = publicDashboards[index];
      dashboard.queryMatches = [];

      const dashboardWithWidgets = await dashboardRepo.getDashboardWithWidgets(dashboard.id);

      if (dashboardWithWidgets.name.toLowerCase().includes(query)) {
        dashboard.queryMatches.push(dashboardWithWidgets.name);
        found = true;
      }

      if (dashboardWithWidgets.description.toLowerCase().includes(query)) {
        dashboard.queryMatches.push(dashboardWithWidgets.description);
        found = true;
      }

      if (dashboardWithWidgets.widgets) {
        for (var widget of dashboardWithWidgets.widgets) {
          if (widget.content.text) {
            let matches = splitAndSearch(widget.content.text, query);
            if (matches.length) {
              dashboard.queryMatches = dashboard.queryMatches.concat(matches);
              found = true;
            }
          }

          if (widget.content.title) {
            let matches = splitAndSearch(widget.content.title, query);
            if (matches.length) {
              dashboard.queryMatches = dashboard.queryMatches.concat(matches);
              found = true;
            }
          }

          if (widget.content.summary) {
            let matches = splitAndSearch(widget.content.summary, query);
            if (matches.length) {
              dashboard.queryMatches = dashboard.queryMatches.concat(matches);
              found = true;
            }
          }
        }
      }

      if (!found) {
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
