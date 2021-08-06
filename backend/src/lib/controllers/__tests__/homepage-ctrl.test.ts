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

jest.mock("../../repositories/homepage-repo");
jest.mock("../../repositories/dashboard-repo");
jest.mock("../../factories/dashboard-factory");
jest.mock("../../factories/homepage-factory");

const user: User = { userId: "johndoe" };
const repository = mocked(HomepageRepository.prototype);
const dashboardRepo = mocked(DashboardRepository.prototype);
const req = ({} as any) as Request;
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

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
    req = ({
      user,
      body: {
        title: "abc",
        description: "description test",
        updatedAt: now.toISOString(),
      },
    } as any) as Request;
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
