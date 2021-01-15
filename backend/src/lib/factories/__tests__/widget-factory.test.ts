import WidgetFactory from "../widget-factory";
import {
  Widget,
  WidgetType,
  WidgetItem,
  TextWidget,
  ChartWidget,
  TableWidget,
  ChartType,
} from "../../models/widget";

const dummyWidgetName = "Some widget";
const dashboardId = "123";

describe("createWidget", () => {
  it("throw an error for invalid widget types", () => {
    expect(() => {
      const bananaType = "BananaType" as WidgetType;
      WidgetFactory.createWidget({
        name: "BananaWidget",
        dashboardId: "123",
        widgetType: bananaType,
        showTitle: true,
        content: {},
      });
    }).toThrowError("Invalid widget type");
  });
});

describe("createTextWidget", () => {
  it("builds a text widget", () => {
    const content = { text: "Text can include markdown syntax" };
    const widget = WidgetFactory.createWidget({
      name: dummyWidgetName,
      dashboardId,
      widgetType: WidgetType.Text,
      showTitle: true,
      content,
    }) as TextWidget;

    expect(widget.id).toBeDefined();
    expect(widget.name).toEqual(dummyWidgetName);
    expect(widget.dashboardId).toEqual(dashboardId);
    expect(widget.widgetType).toEqual(WidgetType.Text);
    expect(widget.order).toEqual(0);
    expect(widget.showTitle).toBe(true);
    expect(widget.content.text).toEqual("Text can include markdown syntax");
  });

  it("throws an error if text is undefined", () => {
    const content = {};
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Text,
        showTitle: true,
        content,
      });
    }).toThrowError("Text widget must have `content.text` field");
  });
});

describe("createChartWidget", () => {
  it("builds a chart widget", () => {
    const content = {
      title: "Correlation of COVID cases to deaths",
      chartType: "LineChart",
      datasetId: "090b0410",
      summary: "test summary",
      summaryBelow: false,
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      fileName: "abc.csv",
    };

    const widget = WidgetFactory.createWidget({
      name: dummyWidgetName,
      dashboardId,
      widgetType: WidgetType.Chart,
      showTitle: true,
      content,
    }) as ChartWidget;

    expect(widget.id).toBeDefined();
    expect(widget.name).toEqual(dummyWidgetName);
    expect(widget.dashboardId).toEqual(dashboardId);
    expect(widget.showTitle).toBe(true);
    expect(widget.widgetType).toEqual(WidgetType.Chart);
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
    expect(widget.content.summary).toEqual("test summary");
    expect(widget.content.chartType).toEqual("LineChart");
    expect(widget.content.summaryBelow).toBe(false);
  });

  it("throws an error if chart title is undefined", () => {
    const content = { datasetId: "090b0410", chartType: "LineChart" };
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Chart,
        showTitle: true,
        content,
      });
    }).toThrowError("Chart widget must have `content.title` field");
  });

  it("throws an error if datasetId is undefined", () => {
    const content = {
      title: "My chart title",
      chartType: "LineChart",
    };
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Chart,
        showTitle: true,
        content,
      });
    }).toThrowError("Chart widget must have `content.datasetId` field");
  });

  it("throws an error if chartType is undefined", () => {
    const content = { title: "My chart title" };
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Chart,
        showTitle: true,
        content,
      });
    }).toThrowError("Chart widget must have `content.chartType` field");
  });

  it("throws an error if chart type does not exist in ChartType", () => {
    const content = { title: "My chart title", chartType: "TestChart" };
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Chart,
        showTitle: true,
        content,
      });
    }).toThrowError("Invalid chart type");
  });

  it("builds a chart widget with BarChart", () => {
    const content = {
      title: "Correlation of COVID cases to deaths",
      chartType: "BarChart",
      datasetId: "090b0410",
      summary: "test summary",
      summaryBelow: false,
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      fileName: "abc.csv",
    };

    const widget = WidgetFactory.createWidget({
      name: dummyWidgetName,
      dashboardId,
      widgetType: WidgetType.Chart,
      showTitle: true,
      content,
    }) as ChartWidget;

    expect(widget.content.chartType).toEqual("BarChart");
  });

  it("builds a chart widget with PartWholeChart", () => {
    const content = {
      title: "Correlation of COVID cases to deaths",
      chartType: "PartWholeChart",
      datasetId: "090b0410",
      summary: "test summary",
      summaryBelow: false,
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      fileName: "abc.csv",
    };

    const widget = WidgetFactory.createWidget({
      name: dummyWidgetName,
      dashboardId,
      widgetType: WidgetType.Chart,
      showTitle: true,
      content,
    }) as ChartWidget;

    expect(widget.content.chartType).toEqual("PartWholeChart");
  });
});

describe("createTableWidget", () => {
  it("builds a table widget", () => {
    const content = {
      title: "Correlation of COVID cases to deaths",
      datasetId: "090b0410",
      summaryBelow: false,
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      fileName: "abc.csv",
    };

    const widget = WidgetFactory.createWidget({
      name: dummyWidgetName,
      dashboardId,
      widgetType: WidgetType.Table,
      showTitle: true,
      content,
    }) as TableWidget;

    expect(widget.id).toBeDefined();
    expect(widget.name).toEqual(dummyWidgetName);
    expect(widget.dashboardId).toEqual(dashboardId);
    expect(widget.widgetType).toEqual(WidgetType.Table);
    expect(widget.showTitle).toBe(true);
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
    expect(widget.content.summaryBelow).toBe(false);
  });

  it("throws an error if table title is undefined", () => {
    const content = {};
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Table,
        showTitle: true,
        content,
      });
    }).toThrowError("Table widget must have `content.title` field");
  });

  it("throws an error if datasetId is undefined", () => {
    const content = { title: "COVID cases" };
    expect(() => {
      WidgetFactory.createWidget({
        name: dummyWidgetName,
        dashboardId,
        widgetType: WidgetType.Table,
        showTitle: true,
        content,
      });
    }).toThrowError("Table widget must have `content.datasetId` field");
  });
});

describe("fromItem", () => {
  it("converts a dynamodb item into a TextWidget object", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Text",
      type: "Widget",
      order: 1,
      updatedAt: "2020-09-17T00:24:35.000Z",
      showTitle: false,
      content: {
        text: "Random text",
      },
    };

    const widget = WidgetFactory.fromItem(item) as TextWidget;

    expect(widget.id).toEqual("xyz");
    expect(widget.dashboardId).toEqual("abc");
    expect(widget.name).toEqual("Random name");
    expect(widget.widgetType).toEqual(WidgetType.Text);
    expect(widget.order).toEqual(1);
    expect(widget.showTitle).toBe(false);
    expect(widget.updatedAt).toEqual(new Date("2020-09-17T00:24:35.000Z"));
    expect(widget.content.text).toEqual("Random text");
  });

  it("converts a dynamodb item into a ChartWidget object", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Chart",
      type: "Widget",
      order: 1,
      updatedAt: "2020-09-17T00:24:35.000Z",
      showTitle: false,
      content: {
        title: "Correlation of COVID cases to deaths",
        chartType: "LineChart",
        summary: "test summary",
        summaryBelow: false,
        datasetId: "090b0410",
      },
    };

    const widget = WidgetFactory.fromItem(item) as ChartWidget;

    expect(widget.id).toEqual("xyz");
    expect(widget.dashboardId).toEqual("abc");
    expect(widget.name).toEqual("Random name");
    expect(widget.widgetType).toEqual(WidgetType.Chart);
    expect(widget.content.datasetId).toEqual("090b0410");
    expect(widget.order).toEqual(1);
    expect(widget.showTitle).toBe(false);
    expect(widget.updatedAt).toEqual(new Date("2020-09-17T00:24:35.000Z"));
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
    expect(widget.content.summary).toEqual("test summary");
    expect(widget.content.summaryBelow).toBe(false);
    expect(widget.content.chartType).toEqual("LineChart");
  });

  it("converts a dynamodb item into a TableWidget object", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Table",
      type: "Widget",
      order: 1,
      updatedAt: "2020-09-17T00:24:35.000Z",
      showTitle: false,
      content: {
        title: "Correlation of COVID cases to deaths",
        datasetId: "090b0410",
        summary: "test summary",
        summaryBelow: false,
      },
    };

    const widget = WidgetFactory.fromItem(item) as TableWidget;

    expect(widget.id).toEqual("xyz");
    expect(widget.dashboardId).toEqual("abc");
    expect(widget.name).toEqual("Random name");
    expect(widget.widgetType).toEqual(WidgetType.Table);
    expect(widget.content.datasetId).toEqual("090b0410");
    expect(widget.order).toEqual(1);
    expect(widget.showTitle).toBe(false);
    expect(widget.updatedAt).toEqual(new Date("2020-09-17T00:24:35.000Z"));
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
    expect(widget.content.summary).toEqual("test summary");
    expect(widget.content.summaryBelow).toBe(false);
  });

  it("handles an invalid widget type gracefully", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Banana", // Invalid widget type
      type: "Widget",
      order: 1,
      updatedAt: "2020-09-17T00:24:35",
      content: {},
    };

    // If for any reason, the WidgeType is invalid in DynamoDB, we
    // don't want to crash the serialization of the item. We want the
    // mapping to be handled gracefully and map at least the generic
    // attributes of a Widget: id, name, dashboardId.

    expect(() => {
      const widget = WidgetFactory.fromItem(item);
      expect(widget.id).toEqual("xyz");
      expect(widget.name).toEqual("Random name");
      expect(widget.dashboardId).toEqual("abc");
    }).not.toThrowError();
  });
});

describe("toItem", () => {
  it("converts a TextWidget into a dynamodb item", () => {
    const now = new Date();
    const widget: TextWidget = {
      id: "abc",
      name: dummyWidgetName,
      dashboardId: dashboardId,
      widgetType: WidgetType.Text,
      order: 5,
      updatedAt: now,
      showTitle: false,
      content: {
        text: "Pizza and Beer",
      },
    };

    const item = WidgetFactory.toItem(widget);

    expect(item.pk).toEqual("Dashboard#".concat(dashboardId));
    expect(item.sk).toEqual("Widget#abc");
    expect(item.name).toEqual(dummyWidgetName);
    expect(item.widgetType).toEqual("Text");
    expect(item.type).toEqual("Widget");
    expect(item.order).toEqual(5);
    expect(item.showTitle).toBe(false);
    expect(item.updatedAt).toEqual(now.toISOString());
    expect(item.content).toEqual({
      text: "Pizza and Beer",
    });
  });

  it("converts a ChartWidget into a dynamodb item", () => {
    const now = new Date();
    const widget: ChartWidget = {
      id: "abc",
      name: dummyWidgetName,
      dashboardId: dashboardId,
      widgetType: WidgetType.Chart,
      order: 5,
      updatedAt: now,
      showTitle: false,
      content: {
        title: "Correlation of COVID cases to deaths",
        chartType: ChartType.LineChart,
        datasetId: "090b0410",
        summary: "test summary",
        summaryBelow: false,
        s3Key: {
          raw: "abc.csv",
          json: "abc.json",
        },
        fileName: "abc.csv",
      },
    };

    const item = WidgetFactory.toItem(widget);

    expect(item.pk).toEqual("Dashboard#".concat(dashboardId));
    expect(item.sk).toEqual("Widget#abc");
    expect(item.name).toEqual(dummyWidgetName);
    expect(item.widgetType).toEqual("Chart");
    expect(item.type).toEqual("Widget");
    expect(item.order).toEqual(5);
    expect(item.showTitle).toBe(false);
    expect(item.updatedAt).toEqual(now.toISOString());
    expect(item.content).toEqual({
      title: "Correlation of COVID cases to deaths",
      chartType: "LineChart",
      datasetId: "090b0410",
      summary: "test summary",
      summaryBelow: false,
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      fileName: "abc.csv",
    });
  });

  it("converts a Table into a dynamodb item", () => {
    const now = new Date();
    const widget: TableWidget = {
      id: "abc",
      name: dummyWidgetName,
      dashboardId: dashboardId,
      widgetType: WidgetType.Table,
      order: 1,
      updatedAt: now,
      showTitle: false,
      content: {
        title: "Correlation of COVID cases to deaths",
        datasetId: "090b0410",
        summary: "test summary",
        summaryBelow: false,
        s3Key: {
          raw: "abc.csv",
          json: "abc.json",
        },
        fileName: "abc.csv",
      },
    };

    const item = WidgetFactory.toItem(widget);

    expect(item.pk).toEqual("Dashboard#".concat(dashboardId));
    expect(item.sk).toEqual("Widget#abc");
    expect(item.name).toEqual(dummyWidgetName);
    expect(item.widgetType).toEqual("Table");
    expect(item.type).toEqual("Widget");
    expect(item.order).toEqual(1);
    expect(item.showTitle).toBe(false);
    expect(item.updatedAt).toEqual(now.toISOString());
    expect(item.content).toEqual({
      title: "Correlation of COVID cases to deaths",
      datasetId: "090b0410",
      summary: "test summary",
      summaryBelow: false,
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      fileName: "abc.csv",
    });
  });
});

describe("itemPk", () => {
  it("returns the partition key for a dynamodb widget item", () => {
    expect(WidgetFactory.itemPk("123")).toEqual("Dashboard#123");
  });
});

describe("itemSk", () => {
  it("returns the sort key for a dynamodb widget item", () => {
    expect(WidgetFactory.itemSk("abc")).toEqual("Widget#abc");
  });
});

describe("createFromWidget", () => {
  const dashboardId = "001";
  const widget: Widget = {
    id: "abc",
    name: "Text Widget",
    widgetType: WidgetType.Text,
    dashboardId: "123",
    order: 1,
    updatedAt: new Date(),
    showTitle: true,
    content: {
      text: "Hello",
    },
  };

  it("returns a new widget with a new id", () => {
    const newWidget = WidgetFactory.createFromWidget(dashboardId, widget);
    expect(newWidget.id).not.toEqual("abc");
  });

  it("returns a new widget associated to the given dashboard", () => {
    const newWidget = WidgetFactory.createFromWidget(dashboardId, widget);
    expect(newWidget.dashboardId).toEqual("001");
  });

  it("returns a new widget with all other attributes", () => {
    const newWidget = WidgetFactory.createFromWidget(dashboardId, widget);
    expect(newWidget).toEqual(
      expect.objectContaining({
        name: "Text Widget",
        widgetType: WidgetType.Text,
        order: 1,
        showTitle: true,
        content: {
          text: "Hello",
        },
      })
    );
  });
});
