const { IoT1ClickDevicesService } = require("aws-sdk");
const { buildExamplesFromContents } = require("../examplebuilder");
const exampleBuilder = require("../examplebuilder");

describe("buildExamplesFromContents", function () {

    it("builds out examples base on expected dir structure", function () {

        //arrange
        const s3Contents = [
            { Key: "english/dashboard1/dashboard.json" },
            { Key: "english/dashboard1/topicarea.json" },

            { Key: "english/dashboard1/widgets/chart1.json" },
            { Key: "english/dashboard1/widgets/chart2.json" },

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
            { Key: "english/dashboard2/data/line2.json" },
            { Key: "english/dashboard2/data/line2.csv" },
        ];

        const expected1 = new exampleBuilder.ExampleConfig("dashboard1");
        expected1.topicAreaS3Key = "english/dashboard1/topicarea.json";
        expected1.dashboardS3Key = "english/dashboard1/dashboard.json";
        expected1.widgets = [
            new exampleBuilder.WidgetConfig(
                "english/dashboard1/widgets/chart1.json",
                "chart1",
                "english/dashboard1/datasets/chart1.json",
                [
                    "english/dashboard1/data/chart1.json",
                    "english/dashboard1/data/chart1.csv"
                ]),
            new exampleBuilder.WidgetConfig(
                "english/dashboard1/widgets/chart2.json",
                "chart2",
                "english/dashboard1/datasets/chart2.json",
                [
                    "english/dashboard1/data/chart2.json",
                    "english/dashboard1/data/chart2.csv"
                ])
        ];

        const expected2 = new exampleBuilder.ExampleConfig("dashboard2");
        expected2.topicAreaS3Key = "english/dashboard2/topicarea.json";
        expected2.dashboardS3Key = "english/dashboard2/dashboard.json";
        expected2.widgets = [
            new exampleBuilder.WidgetConfig(
                "english/dashboard2/widgets/line1.json",
                "line1",
                "english/dashboard2/datasets/line1.json",
                [
                    "english/dashboard2/data/line1.json",
                    "english/dashboard2/data/line1.csv"
                ]),
            new exampleBuilder.WidgetConfig(
                "english/dashboard2/widgets/line2.json",
                "line2",
                "english/dashboard2/datasets/line2.json",
                [
                    "english/dashboard2/data/line2.json",
                    "english/dashboard2/data/line2.csv"
                ])
        ];

        //act
        const results = exampleBuilder.buildExamplesFromContents(s3Contents, "english/");

        //assert
        const dashboard1 = results.get("dashboard1");
        const dashboard2 = results.get("dashboard2");

        expect(dashboard1).toStrictEqual(expected1);
        expect(dashboard2).toStrictEqual(expected2);
    });
});
