import { Widget } from "../models";

function moveWidget(
  widgets: Array<Widget>,
  index: number,
  newIndex: number
): Array<Widget> {
  // If new position is out of bounds, don't move anything.
  if (newIndex < 0 || newIndex >= widgets.length) {
    return widgets;
  }

  // Create a new widgets array so we don't modify the one
  // passed as parameter.
  const reordered = widgets.map((widget) => ({
    ...widget,
  }));

  const widget = reordered[index];
  const neighbor = reordered[newIndex];

  // Swap widget with neighbor
  let oldPosition = widget.order;
  let newPosition = neighbor.order;

  widget.order = newPosition;
  neighbor.order = oldPosition;

  reordered[newIndex] = widget;
  reordered[index] = neighbor;

  return reordered;
}

const WidgetOrdering = {
  moveWidget,
};

export default WidgetOrdering;
