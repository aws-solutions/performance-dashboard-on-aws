import { mocked } from "ts-jest/utils";
import { Homepage, HomepageItem } from "../../models/homepage";
import HomepageRepository from "../homepage-repo";
import DynamoDBService from "../../services/dynamodb";
import S3Service from "../../services/s3";

jest.mock("../../services/dynamodb");
jest.mock("../../services/s3");
jest.mock("../../factories/dataset-factory");

let tableName: string;
let repo: HomepageRepository;
let dynamodb = mocked(DynamoDBService.prototype);
let s3Service = mocked(S3Service.prototype);

beforeAll(() => {
  tableName = "BadgerTable";
  process.env.BADGER_TABLE = tableName;

  DynamoDBService.getInstance = jest.fn().mockReturnValue(dynamodb);
  S3Service.getInstance = jest.fn().mockReturnValue(s3Service);
  repo = HomepageRepository.getInstance();
});

describe("getHomepage", () => {
  it("returns undefined if Homepage is not found", async () => {
    dynamodb.get = jest.fn().mockReturnValueOnce({ Item: null });
    const homepage = await repo.getHomepage();
    expect(homepage).toBeUndefined();
  });

  it("returns a Homepage if found on database", async () => {
    const item: HomepageItem = {
      pk: "Homepage",
      sk: "Homepage",
      type: "Homepage",
      title: "Kingdom of Wakanda",
      description: "Welcome to our kingdom",
    };

    dynamodb.get = jest.fn().mockReturnValueOnce({ Item: item });
    const homepage = (await repo.getHomepage()) as Homepage;

    expect(homepage.title).toEqual("Kingdom of Wakanda");
    expect(homepage.description).toEqual("Welcome to our kingdom");
  });
});
