import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import { User } from "../../models/user";
import {
  Dashboard,
  DashboardState,
  PublicDashboard,
} from "../../models/dashboard";
import HomepageFactory from "../../factories/homepage-factory";
import HomepageRepository from "../../repositories/homepage-repo";
import DashboardRepository from "../../repositories/dashboard-repo";
import DashboardFactory from "../../factories/dashboard-factory";
import HomepageCtrl from "../homepage-ctrl";
import { WidgetType } from "../../models/widget";

jest.mock("../../repositories/homepage-repo");
jest.mock("../../repositories/dashboard-repo");
jest.mock("../../factories/dashboard-factory");
jest.mock("../../factories/homepage-factory");

const user: User = { userId: "johndoe" };
const repository = mocked(HomepageRepository.prototype);
const dashboardRepo = mocked(DashboardRepository.prototype);
const req = {} as any as Request;
const res = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any as Response;

beforeEach(() => {
  HomepageRepository.getInstance = jest.fn().mockReturnValue(repository);
  DashboardRepository.getInstance = jest.fn().mockReturnValue(dashboardRepo);
  dashboardRepo.listPublishedDashboards = jest.fn().mockReturnValue([]);
});

describe("getPublicHomepage", () => {
  it("returns default values for homepage", async () => {
    // No Homepage found on the database
    repository.getHomepage = jest.fn().mockReturnValueOnce(undefined);

    // Homepage factory should provide the default homepage
    HomepageFactory.getDefaultHomepage = jest.fn().mockReturnValueOnce({
      title: "Performance Dashboard",
      description: "Welcome to the performance dashboard",
    });

    await HomepageCtrl.getPublicHomepage(req, res);
    expect(HomepageFactory.getDefaultHomepage).toBeCalled();
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        title: "Performance Dashboard",
        description: "Welcome to the performance dashboard",
      })
    );
  });

  it("returns homepage when available in the database", async () => {
    HomepageFactory.getDefaultHomepage = jest.fn();
    repository.getHomepage = jest.fn().mockReturnValueOnce({
      title: "Kingdom of Wakanda",
      description: "Welcome to the performance dashboard of our kingdom",
    });

    await HomepageCtrl.getPublicHomepage(req, res);
    expect(HomepageFactory.getDefaultHomepage).not.toBeCalled();
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        title: "Kingdom of Wakanda",
        description: "Welcome to the performance dashboard of our kingdom",
      })
    );
  });

  it("returns a list of published dashboards", async () => {
    const now = new Date();
    const published: Array<Dashboard> = [
      {
        id: "123",
        name: "Banana",
        version: 1,
        parentDashboardId: "123",
        description: "Something",
        createdBy: "johndoe",
        updatedAt: now,
        state: DashboardState.Published,
        topicAreaId: "xyz",
        topicAreaName: "Health and Human Services",
        displayTableOfContents: false,
      },
    ];

    HomepageFactory.getDefaultHomepage = jest.fn().mockReturnValueOnce({
      title: "Performance Dashboard",
      description: "Welcome to the performance dashboard",
    });
    dashboardRepo.listPublishedDashboards = jest
      .fn()
      .mockReturnValue(published);

    const publicDashboard: PublicDashboard = {
      id: "123",
      name: "Banana",
      description: "Something",
      updatedAt: now,
      topicAreaId: "xyz",
      topicAreaName: "Health and Human Services",
      displayTableOfContents: false,
    };

    DashboardFactory.toPublic = jest.fn().mockReturnValue(publicDashboard);
    await HomepageCtrl.getPublicHomepage(req, res);

    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        dashboards: [publicDashboard],
      })
    );
  });
});

describe("getHomepage", () => {
  it("returns default values for homepage", async () => {
    // No Homepage found on the database
    repository.getHomepage = jest.fn().mockReturnValueOnce(undefined);

    // Homepage factory should provide the default homepage
    HomepageFactory.getDefaultHomepage = jest.fn().mockReturnValueOnce({
      title: "Performance Dashboard",
      description: "Welcome to the performance dashboard",
    });

    await HomepageCtrl.getHomepage(req, res);
    expect(HomepageFactory.getDefaultHomepage).toBeCalled();
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        title: "Performance Dashboard",
        description: "Welcome to the performance dashboard",
      })
    );
  });

  it("returns homepage when available in the database", async () => {
    HomepageFactory.getDefaultHomepage = jest.fn();
    repository.getHomepage = jest.fn().mockReturnValueOnce({
      title: "Kingdom of Wakanda",
      description: "Welcome to the performance dashboard of our kingdom",
    });

    await HomepageCtrl.getHomepage(req, res);
    expect(HomepageFactory.getDefaultHomepage).not.toBeCalled();
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        title: "Kingdom of Wakanda",
        description: "Welcome to the performance dashboard of our kingdom",
      })
    );
  });
});

describe("updateHomepage", () => {
  let req: Request;
  const now = new Date();
  jest.useFakeTimers("modern");
  jest.setSystemTime(now);
  beforeEach(() => {
    req = {
      user,
      body: {
        title: "abc",
        description: "description test",
        updatedAt: now.toISOString(),
      },
    } as any as Request;
  });

  it("returns a 400 error when title is missing", async () => {
    delete req.body.title;
    await HomepageCtrl.updateHomepage(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `title`");
  });

  it("returns a 400 error when description is missing", async () => {
    delete req.body.description;
    await HomepageCtrl.updateHomepage(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `description`");
  });

  it("returns a 400 error when updatedAt is missing", async () => {
    delete req.body.updatedAt;
    await HomepageCtrl.updateHomepage(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledWith("Missing required body `updatedAt`");
  });

  it("update the homepage", async () => {
    await HomepageCtrl.updateHomepage(req, res);
    expect(repository.updateHomepage).toHaveBeenCalledWith(
      "abc",
      "description test",
      now.toISOString(),
      user
    );
  });
});

describe("getPublicHomepageWithQuery", () => {
  let req: Request;
  beforeEach(() => {
    req = {
      user,
      params: {
        query: "UK",
      },
    } as any as Request;
    jest.resetAllMocks();
    jest.resetModules();
    HomepageRepository.getInstance = jest.fn().mockReturnValue(repository);
    DashboardRepository.getInstance = jest.fn().mockReturnValue(dashboardRepo);
  });

  it("returns a list of published dashboards with content matching a query", async () => {
    const now = new Date();

    // The two public dashboards.
    const publicDashboard1: PublicDashboard = {
      id: "123",
      name: "USA",
      topicAreaId: "xyz",
      topicAreaName: "North America",
      displayTableOfContents: false,
      description: "All about the United States of America.",
      updatedAt: now,
    };
    const publicDashboard2: PublicDashboard = {
      id: "456",
      name: "UK",
      topicAreaId: "abc",
      topicAreaName: "Europe",
      displayTableOfContents: false,
      description: "All about the United Kingdom.",
      updatedAt: now,
    };

    // The two corresponding published dashboards.
    let publishedDashboard1: Dashboard = {
      ...publicDashboard1,
      version: 1,
      parentDashboardId: "123",
      createdBy: "johndoe",
      state: DashboardState.Published,
    };
    let publishedDashboard2: Dashboard = {
      ...publicDashboard2,
      version: 1,
      parentDashboardId: "456",
      createdBy: "johndoe",
      state: DashboardState.Published,
    };

    // The two corresponding published dashboards with widgets.
    let publishedDashboardWithWidget1: Dashboard = {
      ...publishedDashboard1,
      widgets: [
        {
          id: "111",
          name: "Geography of the USA",
          widgetType: WidgetType.Text,
          dashboardId: "123",
          order: 1,
          updatedAt: now,
          content: {
            text: "The USA is in North America. The capital of the USA is Washington, DC.",
          },
        },
      ],
    };
    let publishedDashboardWithWidget2: Dashboard = {
      ...publishedDashboard2,
      widgets: [
        {
          id: "222",
          name: "Geography of the UK",
          widgetType: WidgetType.Text,
          dashboardId: "456",
          order: 1,
          updatedAt: now,
          content: {
            text: "The UK is in Europe. The capital of the UK is London.",
          },
        },
      ],
    };

    repository.getHomepage = jest.fn().mockReturnValueOnce({
      title: "Performance Dashboard",
      description: "Welcome to the performance dashboard",
    });
    HomepageFactory.getDefaultHomepage = jest.fn().mockReturnValueOnce({
      title: "Performance Dashboard",
      description: "Welcome to the performance dashboard",
    });
    dashboardRepo.listPublishedDashboards = jest
      .fn()
      .mockReturnValue([publishedDashboard1, publishedDashboard2]);
    DashboardFactory.toPublic = jest
      .fn()
      .mockReturnValueOnce(publicDashboard1)
      .mockReturnValueOnce(publicDashboard2);
    dashboardRepo.getDashboardWithWidgets = jest
      .fn()
      .mockReturnValueOnce(publishedDashboardWithWidget2)
      .mockReturnValueOnce(publishedDashboardWithWidget1);

    const matchedDashboard: PublicDashboard[] = [
      {
        id: "456",
        name: "UK",
        topicAreaId: "abc",
        topicAreaName: "Europe",
        displayTableOfContents: false,
        description: "All about the United Kingdom.",
        updatedAt: now,
        queryMatches: [
          "UK",
          "The UK is in Europe.",
          "The capital of the UK is London.",
        ],
      },
    ];

    await HomepageCtrl.getPublicHomepageWithQuery(req, res);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        dashboards: matchedDashboard,
      })
    );
  });
});
