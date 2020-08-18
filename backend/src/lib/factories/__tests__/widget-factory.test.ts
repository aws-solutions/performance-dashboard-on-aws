import WidgetFactory from "../widget-factory";
import { WidgetType, WidgetItem, TextWidget } from "../../models/widget";

const dummyWidgetName = "Some widget";
const dashboardId = "123";

describe("createWidget", () => {
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

  it("throw an error for invalid widget types", () => {
    expect(() => {
      const bananaType = "BananaType" as WidgetType;
      WidgetFactory.createWidget("BananaWidget", "123", bananaType, {});
    }).toThrowError();
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
});
