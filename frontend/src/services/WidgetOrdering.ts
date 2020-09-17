import { Widget } from "../models";

function moveAndReOrder(
  widgets: Array<Widget>,
  widgetToMove: Widget,
  newPosition: number
): Array<Widget> {
  // If new position is out of bounds, don't move anything.
  if (newPosition < 0 || newPosition >= widgets.length) {
    return widgets;
  }

  // By moving this widget to newPosition, the neighbor widget on that position
  // will be affected and should swap places to the widget's old position.
  const neighbor = widgets.find((widget) => widget.order === newPosition);
  const oldPosition = widgetToMove.order;

  return widgets.map((widget) => {
    let position = widget.order;
    if (widget.id === widgetToMove.id) {
      position = newPosition;
    }

    if (neighbor?.id === widget.id) {
      position = oldPosition;
    }

    return {
      ...widget,
      order: position,
    };
  });
}

export default {
  moveAndReOrder,
};
