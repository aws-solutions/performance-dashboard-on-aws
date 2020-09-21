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

test("does not change order if new index is less than zero", () => {
  const index = 0;
  const newIndex = -1;
  const ordered = WidgetOrderingService.moveWidget(widgets, index, newIndex);

  expectWidgetInPosition(ordered, "Banana", 0);
  expectWidgetInPosition(ordered, "Strawberry", 1);
  expectWidgetInPosition(ordered, "Apple", 2);
});

test("does not change order if new index exceeds length", () => {
  const index = 0;
  const newIndex = widgets.length; // out of bounds
  const ordered = WidgetOrderingService.moveWidget(widgets, index, newIndex);

  expectWidgetInPosition(ordered, "Banana", 0);
  expectWidgetInPosition(ordered, "Strawberry", 1);
  expectWidgetInPosition(ordered, "Apple", 2);
});

test("banana widget moves one position up", () => {
  const indexOfBanana = 0;
  const newIndex = indexOfBanana + 1;
  const ordered = WidgetOrderingService.moveWidget(
    widgets,
    indexOfBanana,
    newIndex
  );

  expectWidgetInPosition(ordered, "Banana", 1);
  expectWidgetInPosition(ordered, "Strawberry", 0);
  expectWidgetInPosition(ordered, "Apple", 2);
});

test("apple widget moves one position down", () => {
  const indexOfApple = 2;
  const newIndex = indexOfApple - 1;
  const ordered = WidgetOrderingService.moveWidget(
    widgets,
    indexOfApple,
    newIndex
  );

  expectWidgetInPosition(ordered, "Banana", 0);
  expectWidgetInPosition(ordered, "Strawberry", 2);
  expectWidgetInPosition(ordered, "Apple", 1);
});

test("move widget two positions down", () => {
  const indexOfBanana = 0;
  const newIndex = indexOfBanana + 2;
  const ordered = WidgetOrderingService.moveWidget(
    widgets,
    indexOfBanana,
    newIndex
  );

  expectWidgetInPosition(ordered, "Banana", 2);
  expectWidgetInPosition(ordered, "Strawberry", 1);
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
