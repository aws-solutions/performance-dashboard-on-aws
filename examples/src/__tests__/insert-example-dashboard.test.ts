import { setupDashboards } from "../insert-example-dashboard";
import awsWrapper from "../aws-wrapper";
import storage from "../storage";
import { Config } from "../config";

jest.mock("../storage");
jest.mock("../aws-wrapper");

const s3Contents = [
  { Key: "english/dashboard1/dashboard.json" },
  { Key: "english/dashboard1/topicarea.json" },

  { Key: "english/dashboard1/widgets/chart1.json" },
  { Key: "english/dashboard1/widgets/chart2.json" },
  { Key: "english/dashboard1/widgets/text.json" },

  { Key: "english/dashboard1/datasets/chart1.json" },
  { Key: "english/dashboard1/datasets/chart2.json" },

  { Key: "english/dashboard1/data/chart1.json" },
  { Key: "english/dashboard1/data/chart1.csv" },
  { Key: "english/dashboard1/data/chart2.json" },
  { Key: "english/dashboard1/data/chart2.csv" },

  { Key: "english/dashboard2/dashboard.json" },
  { Key: "english/dashboard2/topicarea.json" },

  { Key: "english/dashboard2/widgets/line1.json" },
  { Key: "english/dashboard2/widgets/line2.json" },

  { Key: "english/dashboard2/datasets/line1.json" },
  { Key: "english/dashboard2/datasets/line2.json" },

  { Key: "english/dashboard2/data/line1.json" },
  { Key: "english/dashboard2/data/line1.csv" },
  { Key: "english/dashboard2/data/line2.csv" },
  { Key: "english/dashboard2/data/line2.json" },
];
const config: Config = {
  tableName: "tableName1",
  examplesBucket: "exampleBucket",
  datasetsBucket: "datasetBucket",
  userEmail: "user@mail.com",
  language: "english",
};

beforeEach(() => {
  awsWrapper.getBucketContents = jest
    .fn()
    .mockReturnValue(Promise.resolve(s3Contents));

  awsWrapper.copyContent = jest.fn().mockReturnValue(Promise.resolve({}));
  storage.saveTopicArea = jest.fn().mockReturnValue(Promise.resolve("ta1"));
  storage.saveDashboard = jest.fn().mockReturnValue(Promise.resolve("db1"));
  storage.saveText = jest.fn().mockReturnValue(Promise.resolve("saveText1"));
  storage.saveChart = jest.fn().mockReturnValue(Promise.resolve("saveChart1"));
  storage.saveDataset = jest
    .fn()
    .mockReturnValue(Promise.resolve("saveDataset1"));
});

describe("setupDashboards", function () {
  it("gets content of example bucket", function (done) {
    //act
    setupDashboards(config).then(() => {
      //assert
      expect(awsWrapper.getBucketContents).toBeCalledWith(
        config.examplesBucket,
        config.language + "/"
      );

      done();
    });
  });

  it("saves topic area", function (done) {
    //act
    setupDashboards(config).then(() => {
      //assert
      expect(storage.saveTopicArea).toBeCalledWith(
        expect.objectContaining(config),
        "english/dashboard1/topicarea.json"
      );
      expect(storage.saveTopicArea).toBeCalledWith(
        expect.objectContaining(config),
        "english/dashboard2/topicarea.json"
      );

      done();
    });
  });

  it("saves dashboard", function (done) {
    //act
    setupDashboards(config).then(() => {
      //assert
      expect(storage.saveDashboard).toBeCalledWith(
        expect.objectContaining(config),
        "ta1",
        "english/dashboard1/dashboard.json"
      );
      expect(storage.saveDashboard).toBeCalledWith(
        expect.objectContaining(config),
        "ta1",
        "english/dashboard2/dashboard.json"
      );

      done();
    });
  });

  it("saves saveChart", function (done) {
    //act
    setupDashboards(config).then(() => {
      //assert
      expect(storage.saveChart).toBeCalledWith(
        expect.objectContaining(config),
        "db1",
        expect.anything(),
        expect.anything(),
        "english/dashboard1/widgets/chart1.json"
      );
      expect(storage.saveChart).toBeCalledWith(
        expect.objectContaining(config),
        "db1",
        expect.anything(),
        expect.anything(),
        "english/dashboard2/widgets/line1.json"
      );

      done();
    });
  });
  it("saves saveDataset", function (done) {
    //act
    setupDashboards(config).then(() => {
      //assert
      expect(storage.saveDataset).toBeCalledWith(
        expect.objectContaining(config),
        expect.anything(),
        expect.anything(),
        "english/dashboard1/datasets/chart1.json"
      );
      expect(storage.saveDataset).toBeCalledWith(
        expect.objectContaining(config),
        expect.anything(),
        expect.anything(),
        "english/dashboard2/datasets/line1.json"
      );

      done();
    });
  });

  it("copies data files", function (done) {
    //act
    setupDashboards(config).then(() => {
      //assert
      expect(awsWrapper.copyContent).toBeCalledWith(
        config.examplesBucket,
        "english/dashboard1/data/chart1.json",
        config.datasetsBucket,
        expect.anything()
      );
      expect(awsWrapper.copyContent).toBeCalledWith(
        config.examplesBucket,
        "english/dashboard1/data/chart1.csv",
        config.datasetsBucket,
        expect.anything()
      );
      expect(awsWrapper.copyContent).toBeCalledWith(
        config.examplesBucket,
        "english/dashboard2/data/line1.json",
        config.datasetsBucket,
        expect.anything()
      );
      expect(awsWrapper.copyContent).toBeCalledWith(
        config.examplesBucket,
        "english/dashboard2/data/line1.csv",
        config.datasetsBucket,
        expect.anything()
      );

      done();
    });
  });
});
