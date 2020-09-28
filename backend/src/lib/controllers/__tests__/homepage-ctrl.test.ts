import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";
import HomepageFactory from "../../factories/homepage-factory";
import HomepageRepository from "../../repositories/homepage-repo";
import HomepageCtrl from "../homepage-ctrl";

jest.mock("../../repositories/homepage-repo");
jest.mock("../../factories/homepage-factory");

const repository = mocked(HomepageRepository.prototype);
const req = ({} as any) as Request;
const res = ({
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any) as Response;

beforeEach(() => {
  HomepageRepository.getInstance = jest.fn().mockReturnValue(repository);
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
    expect(res.json).toBeCalledWith({
      title: "Performance Dashboard",
      description: "Welcome to the performance dashboard",
    });
  });

  it("returns homepage when available in the database", async () => {
    HomepageFactory.getDefaultHomepage = jest.fn();
    repository.getHomepage = jest.fn().mockReturnValueOnce({
      title: "Kingdom of Wakanda",
      description: "Welcome to the performance dashboard of our kingdom",
    });

    await HomepageCtrl.getHomepage(req, res);
    expect(HomepageFactory.getDefaultHomepage).not.toBeCalled();
    expect(res.json).toBeCalledWith({
      title: "Kingdom of Wakanda",
      description: "Welcome to the performance dashboard of our kingdom",
    });
  });
});
