const setupDashboards = require("../insert-example-dashboard");
const awsWrapper = require("../aws-wrapper");
const appdatabase = require("../appdatabase");

jest.mock("../appdatabase");
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
const tableName = "tableName1";
const examples = "exampleBucket";
const datasets = "datasetBucket";
const useremail = "useremail";
const language = "english";

const deploymentContext = {
    "datasetBucket": datasets,
    "examplesBucket": examples,
    "tableName": tableName,
    "createdBy": useremail
};

console.log = jest.fn();

beforeEach(() => {
    awsWrapper.getBucketContents = jest.fn().mockReturnValue(Promise.resolve(s3Contents));

    awsWrapper.copyContent = jest.fn().mockReturnValue(Promise.resolve({}));

    appdatabase.uuidv4 = jest.fn().mockReturnValue(1);
    appdatabase.saveTopicArea = jest.fn().mockReturnValue(Promise.resolve("ta1"));
    appdatabase.saveDashboard = jest.fn().mockReturnValue(Promise.resolve("db1"));
    appdatabase.saveText = jest.fn().mockReturnValue(Promise.resolve("saveText1"));
    appdatabase.saveChart = jest.fn().mockReturnValue(Promise.resolve("saveChart1"));
    appdatabase.saveDataset = jest.fn().mockReturnValue(Promise.resolve("saveDataset1"));

});

describe("setupDashboards", function () {

    it("gets content of example bucket", function (done) {

        //act
        setupDashboards(datasets, examples, tableName, useremail, language).then(() => {
            //assert
            expect(awsWrapper.getBucketContents).toBeCalledWith(examples, language + "/");

            done();
        });
    });

    it("saves topic area", function (done) {

        //act
        setupDashboards(datasets, examples, tableName, useremail, language).then(() => {
            //assert
            expect(appdatabase.saveTopicArea).toBeCalledWith(expect.objectContaining(deploymentContext), "english/dashboard1/topicarea.json");
            expect(appdatabase.saveTopicArea).toBeCalledWith(expect.objectContaining(deploymentContext), "english/dashboard2/topicarea.json");

            done();
        });
    });

    it("saves dashboard", function (done) {

        //act
        setupDashboards(datasets, examples, tableName, useremail, language).then(() => {
            //assert
            expect(appdatabase.saveDashboard).toBeCalledWith(expect.objectContaining(deploymentContext), "ta1", "english/dashboard1/dashboard.json");
            expect(appdatabase.saveDashboard).toBeCalledWith(expect.objectContaining(deploymentContext), "ta1", "english/dashboard2/dashboard.json");

            done();
        });
    });

    it("saves saveChart", function (done) {

        //act
        setupDashboards(datasets, examples, tableName, useremail, language).then(() => {
            //assert
            expect(appdatabase.saveChart).toBeCalledWith(expect.objectContaining(deploymentContext), "db1", expect.anything(), expect.anything(), "english/dashboard1/widgets/chart1.json");
            expect(appdatabase.saveChart).toBeCalledWith(expect.objectContaining(deploymentContext), "db1", expect.anything(), expect.anything(), "english/dashboard2/widgets/line1.json");


            done();
        });
    });
    it("saves saveDataset", function (done) {

        //act
        setupDashboards(datasets, examples, tableName, useremail, language).then(() => {
            //assert
            expect(appdatabase.saveDataset).toBeCalledWith(expect.objectContaining(deploymentContext), expect.anything(), expect.anything(), "english/dashboard1/datasets/chart1.json");
            expect(appdatabase.saveDataset).toBeCalledWith(expect.objectContaining(deploymentContext), expect.anything(), expect.anything(), "english/dashboard2/datasets/line1.json");

            done();
        });
    });

    it("copies data files", function (done) {

        //act
        setupDashboards(datasets, examples, tableName, useremail, language).then(() => {
            //assert            
            expect(awsWrapper.copyContent).toBeCalledWith(examples, "english/dashboard1/data/chart1.json", datasets, "public/1.json");
            expect(awsWrapper.copyContent).toBeCalledWith(examples, "english/dashboard1/data/chart1.csv", datasets, "public/1.csv");
            expect(awsWrapper.copyContent).toBeCalledWith(examples, "english/dashboard2/data/line1.json", datasets, "public/1.json");
            expect(awsWrapper.copyContent).toBeCalledWith(examples, "english/dashboard2/data/line1.csv", datasets, "public/1.csv");

            done();
        });
    });
});
