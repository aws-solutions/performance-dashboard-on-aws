import { Widget } from "../../models";
import WidgetOrderingService from "../WidgetOrdering";

const widgets: Array<Widget> = [
  {
    id: "abc",
    name: "Banana",
    order: 0,
    widgetType: "Text",
    updatedAt: "2020-09-17T21:01:00.780Z",
  },
  {
    id: "xyz",
    name: "Strawberry",
    order: 1,
    widgetType: "Chart",
    updatedAt: "2020-09-17T21:01:00.780Z",
  },
  {
    id: "def",
    name: "Apple",
    order: 2,
    widgetType: "Table",
    updatedAt: "2020-09-17T21:01:00.780Z",
  },
];

test("does not change order if new position is less than zero", () => {
  const widgetToMove = widgets[0];
  const newPosition = -1;
  const ordered = WidgetOrderingService.moveAndReOrder(
    widgets,
    widgetToMove,
    newPosition
  );

  expectWidgetInPosition(ordered, "Banana", 0);
  expectWidgetInPosition(ordered, "Strawberry", 1);
  expectWidgetInPosition(ordered, "Apple", 2);
});

test("does not change order if new position is same as length", () => {
  const widgetToMove = widgets[0];
  const newPosition = widgets.length;
  const ordered = WidgetOrderingService.moveAndReOrder(
    widgets,
    widgetToMove,
    newPosition
  );

  expectWidgetInPosition(ordered, "Banana", 0);
  expectWidgetInPosition(ordered, "Strawberry", 1);
  expectWidgetInPosition(ordered, "Apple", 2);
});

test("banana widget moves one position up", () => {
  const banana = widgets[0];
  const newPosition = banana.order + 1;
  const ordered = WidgetOrderingService.moveAndReOrder(
    widgets,
    banana,
    newPosition
  );

  expectWidgetInPosition(ordered, "Banana", 1);
  expectWidgetInPosition(ordered, "Strawberry", 0);
  expectWidgetInPosition(ordered, "Apple", 2);
});

test("apple widget moves one position down", () => {
  const apple = widgets[2];
  const newPosition = apple.order - 1;
  const ordered = WidgetOrderingService.moveAndReOrder(
    widgets,
    apple,
    newPosition
  );

  expectWidgetInPosition(ordered, "Banana", 0);
  expectWidgetInPosition(ordered, "Strawberry", 2);
  expectWidgetInPosition(ordered, "Apple", 1);
});

test("ordering works when all widgets are in position zero", () => {
  // This scenario covers for existing widgets which start in position 0
  const widgets: Array<Widget> = [
    {
      id: "abc",
      name: "Banana",
      order: 0, // newly created widgets start in position zero
      widgetType: "Text",
      updatedAt: "2020-09-17T21:01:00.780Z",
    },
    {
      id: "xyz",
      name: "Strawberry",
      order: 0, // newly created widgets start in position zero
      widgetType: "Text",
      updatedAt: "2020-09-17T21:01:00.780Z",
    },
    {
      id: "def",
      name: "Apple",
      order: 1,
      widgetType: "Text",
      updatedAt: "2020-09-17T21:01:00.780Z",
    },
  ];

  const apple = widgets[2];
  const newPosition = apple.order - 1;
  const ordered = WidgetOrderingService.moveAndReOrder(
    widgets,
    apple,
    newPosition
  );

  expectWidgetInPosition(ordered, "Banana", 1);
  expectWidgetInPosition(ordered, "Strawberry", 0); // remains in position zero
  expectWidgetInPosition(ordered, "Apple", 0);
});

function expectWidgetInPosition(
  widgets: Array<Widget>,
  name: string,
  expectedOrder: number
) {
  const widget = widgets.find((widget) => widget.name === name);
  expect(widget?.order).toEqual(expectedOrder);
}
