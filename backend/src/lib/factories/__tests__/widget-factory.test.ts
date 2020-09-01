import WidgetFactory from "../widget-factory";
import {
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
      WidgetFactory.createWidget("BananaWidget", "123", bananaType, {});
    }).toThrowError("Invalid widget type");
  });
});

describe("createTextWidget", () => {
  it("builds a text widget", () => {
    const content = { text: "Text can include markdown syntax" };
    const widget = WidgetFactory.createWidget(
      dummyWidgetName,
      dashboardId,
      WidgetType.Text,
      content
    ) as TextWidget;

    expect(widget.name).toEqual(dummyWidgetName);
    expect(widget.dashboardId).toEqual(dashboardId);
    expect(widget.widgetType).toEqual(WidgetType.Text);
    expect(widget.content.text).toEqual("Text can include markdown syntax");
  });

  it("throws an error if text is undefined", () => {
    const content = {};
    expect(() => {
      WidgetFactory.createWidget(
        dummyWidgetName,
        dashboardId,
        WidgetType.Text,
        content
      );
    }).toThrowError("Text widget must have `content.text` field");
  });
});

describe("createChartWidget", () => {
  it("builds a chart widget", () => {
    const content = {
      title: "Correlation of COVID cases to deaths",
      chartType: "LineChart",
    };

    const widget = WidgetFactory.createWidget(
      dummyWidgetName,
      dashboardId,
      WidgetType.Chart,
      content
    ) as ChartWidget;

    expect(widget.name).toEqual(dummyWidgetName);
    expect(widget.dashboardId).toEqual(dashboardId);
    expect(widget.widgetType).toEqual(WidgetType.Chart);
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
    expect(widget.content.chartType).toEqual("LineChart");
  });

  it("throws an error if chart title is undefined", () => {
    const content = { chartType: "LineChart" };
    expect(() => {
      WidgetFactory.createWidget(
        dummyWidgetName,
        dashboardId,
        WidgetType.Chart,
        content
      );
    }).toThrowError("Chart widget must have `content.title` field");
  });

  it("throws an error if chart type is undefined", () => {
    const content = { title: "My chart title" };
    expect(() => {
      WidgetFactory.createWidget(
        dummyWidgetName,
        dashboardId,
        WidgetType.Chart,
        content
      );
    }).toThrowError("Chart widget must have `content.chartType` field");
  });
});

describe("createTableWidget", () => {
  it("builds a table widget", () => {
    const content = {
      title: "Correlation of COVID cases to deaths",
    };

    const widget = WidgetFactory.createWidget(
      dummyWidgetName,
      dashboardId,
      WidgetType.Table,
      content
    ) as TableWidget;

    expect(widget.name).toEqual(dummyWidgetName);
    expect(widget.dashboardId).toEqual(dashboardId);
    expect(widget.widgetType).toEqual(WidgetType.Table);
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
  });

  it("throws an error if table title is undefined", () => {
    const content = {};
    expect(() => {
      WidgetFactory.createWidget(
        dummyWidgetName,
        dashboardId,
        WidgetType.Table,
        content
      );
    }).toThrowError("Table widget must have `content.title` field");
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
      content: {
        text: "Random text",
      },
    };

    const widget = WidgetFactory.fromItem(item) as TextWidget;

    expect(widget.id).toEqual("xyz");
    expect(widget.dashboardId).toEqual("abc");
    expect(widget.name).toEqual("Random name");
    expect(widget.widgetType).toEqual(WidgetType.Text);
    expect(widget.content.text).toEqual("Random text");
  });

  it("converts a dynamodb item into a ChartWidget object", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Chart",
      type: "Widget",
      content: {
        title: "Correlation of COVID cases to deaths",
        chartType: "LineChart",
      },
    };

    const widget = WidgetFactory.fromItem(item) as ChartWidget;

    expect(widget.id).toEqual("xyz");
    expect(widget.dashboardId).toEqual("abc");
    expect(widget.name).toEqual("Random name");
    expect(widget.widgetType).toEqual(WidgetType.Chart);
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
    expect(widget.content.chartType).toEqual("LineChart");
  });

  it("converts a dynamodb item into a TableWidget object", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Table",
      type: "Widget",
      content: {
        title: "Correlation of COVID cases to deaths",
      },
    };

    const widget = WidgetFactory.fromItem(item) as TableWidget;

    expect(widget.id).toEqual("xyz");
    expect(widget.dashboardId).toEqual("abc");
    expect(widget.name).toEqual("Random name");
    expect(widget.widgetType).toEqual(WidgetType.Table);
    expect(widget.content.title).toEqual(
      "Correlation of COVID cases to deaths"
    );
  });

  it("handles an invalid widget type gracefully", () => {
    const item: WidgetItem = {
      pk: "Dashboard#abc",
      sk: "Widget#xyz",
      name: "Random name",
      widgetType: "Banana", // Invalid widget type
      type: "Widget",
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
    const widget: TextWidget = {
      id: "abc",
      name: dummyWidgetName,
      dashboardId: dashboardId,
      widgetType: WidgetType.Text,
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
    expect(item.content).toEqual({
      text: "Pizza and Beer",
    });
  });

  it("converts a ChartWidget into a dynamodb item", () => {
    const widget: ChartWidget = {
      id: "abc",
      name: dummyWidgetName,
      dashboardId: dashboardId,
      widgetType: WidgetType.Chart,
      content: {
        title: "Correlation of COVID cases to deaths",
        chartType: ChartType.LineChart,
      },
    };

    const item = WidgetFactory.toItem(widget);

    expect(item.pk).toEqual("Dashboard#".concat(dashboardId));
    expect(item.sk).toEqual("Widget#abc");
    expect(item.name).toEqual(dummyWidgetName);
    expect(item.widgetType).toEqual("Chart");
    expect(item.type).toEqual("Widget");
    expect(item.content).toEqual({
      title: "Correlation of COVID cases to deaths",
      chartType: "LineChart",
    });
  });

  it("converts a ChartWidget into a dynamodb item", () => {
    const widget: TableWidget = {
      id: "abc",
      name: dummyWidgetName,
      dashboardId: dashboardId,
      widgetType: WidgetType.Table,
      content: {
        title: "Correlation of COVID cases to deaths",
      },
    };

    const item = WidgetFactory.toItem(widget);

    expect(item.pk).toEqual("Dashboard#".concat(dashboardId));
    expect(item.sk).toEqual("Widget#abc");
    expect(item.name).toEqual(dummyWidgetName);
    expect(item.widgetType).toEqual("Table");
    expect(item.type).toEqual("Widget");
    expect(item.content).toEqual({
      title: "Correlation of COVID cases to deaths",
    });
  });
});
