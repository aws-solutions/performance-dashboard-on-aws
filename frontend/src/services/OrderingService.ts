import { Metric, Widget, WidgetType } from "../models";

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

  const originalIndex = index;
  const originalNewIndex = newIndex;
  let widget = reordered[index];
  let neighbor = reordered[newIndex];

  if (!widget.section && !neighbor.section) {
    if (
      widget.widgetType !== WidgetType.Section &&
      neighbor.widgetType !== WidgetType.Section
    ) {
      // Swap widget with neighbor
      let oldPosition = widget.order;
      let newPosition = neighbor.order;

      widget.order = newPosition;
      neighbor.order = oldPosition;

      reordered[newIndex] = widget;
      reordered[index] = neighbor;
    } else if (
      widget.widgetType === WidgetType.Section &&
      neighbor.widgetType === WidgetType.Section
    ) {
      if (index < newIndex) {
        while (
          neighbor.id === widgets[originalNewIndex].id ||
          neighbor.section === widgets[originalNewIndex].id
        ) {
          let oldPosition = widget.order;
          let newPosition = neighbor.order;

          widget.order = newPosition;
          neighbor.order = oldPosition;

          reordered[newIndex] = widget;
          reordered[index] = neighbor;

          index++;
          newIndex++;

          if (newIndex >= widgets.length) {
            break;
          }

          widget = reordered[index];
          neighbor = reordered[newIndex];
        }
      } else {
        while (
          widget.id === widgets[originalIndex].id ||
          widget.section === widgets[originalIndex].id
        ) {
          let oldPosition = widget.order;
          let newPosition = neighbor.order;

          widget.order = newPosition;
          neighbor.order = oldPosition;

          reordered[newIndex] = widget;
          reordered[index] = neighbor;

          index++;
          newIndex++;

          if (index >= widgets.length) {
            break;
          }

          widget = reordered[index];
          neighbor = reordered[newIndex];
        }
      }
    } else if (widget.widgetType === WidgetType.Section && index > newIndex) {
      while (
        widget.id === widgets[originalIndex].id ||
        widget.section === widgets[originalIndex].id
      ) {
        let oldPosition = widget.order;
        let newPosition = neighbor.order;

        widget.order = newPosition;
        neighbor.order = oldPosition;

        reordered[newIndex] = widget;
        reordered[index] = neighbor;

        index++;
        newIndex++;

        if (index >= widgets.length) {
          break;
        }

        widget = reordered[index];
        neighbor = reordered[newIndex];
      }
    } else if (widget.widgetType === WidgetType.Section && index < newIndex) {
      // Swap widget with neighbor
      let oldPosition = widget.order;
      let newPosition = neighbor.order;

      widget.order = newPosition;
      neighbor.order = oldPosition;

      reordered[newIndex] = widget;
      reordered[index] = neighbor;
    } else if (neighbor.widgetType === WidgetType.Section && index > newIndex) {
      widget.section = neighbor.id;
      neighbor.content.widgetIds = [
        ...(neighbor.content.widgetIds || []),
        widget.id,
      ];
    } else if (neighbor.widgetType === WidgetType.Section && index < newIndex) {
      // Swap widget with neighbor
      let oldPosition = widget.order;
      let newPosition = neighbor.order;

      widget.order = newPosition;
      neighbor.order = oldPosition;

      reordered[newIndex] = widget;
      reordered[index] = neighbor;

      widget.section = neighbor.id;
      neighbor.content.widgetIds = [
        widget.id,
        ...(neighbor.content.widgetIds || []),
      ];
    }
  } else if (widget.section && neighbor.section) {
    // Swap widget with neighbor
    let oldPosition = widget.order;
    let newPosition = neighbor.order;

    widget.order = newPosition;
    neighbor.order = oldPosition;

    reordered[newIndex] = widget;
    reordered[index] = neighbor;

    const parent = widgets.find((w) => w.id === widget.section);
    if (parent) {
      const indexWidget = parent.content.widgetIds.findIndex(
        (id: string) => id === widget.id
      );
      const indexNeighbor = parent.content.widgetIds.findIndex(
        (id: string) => id === neighbor.id
      );

      const widgetId = parent.content.widgetIds[indexWidget];
      const neighborId = parent.content.widgetIds[indexNeighbor];

      parent.content.widgetIds[indexWidget] = neighborId;
      parent.content.widgetIds[indexNeighbor] = widgetId;
    }
  } else if (widget.section) {
    if (index < newIndex) {
      let parent = widgets.find((w) => w.id === widget.section);
      if (parent) {
        widget.section = undefined;
        parent.content.widgetIds = parent.content.widgetIds.filter(
          (id: string) => id !== widget.id
        );
      }
    } else {
      // Swap widget with neighbor
      let oldPosition = widget.order;
      let newPosition = neighbor.order;

      widget.order = newPosition;
      neighbor.order = oldPosition;

      reordered[newIndex] = widget;
      reordered[index] = neighbor;

      let parent = widgets.find((w) => w.id === widget.section);
      if (parent) {
        widget.section = undefined;
        parent.content.widgetIds = parent.content.widgetIds.filter(
          (id: string) => id !== widget.id
        );
      }
    }
  } else if (neighbor.section) {
    if (index > newIndex) {
      if (widget.widgetType === WidgetType.Section) {
        let parent = reordered.find((w) => w.id === neighbor.section);
        if (parent) {
          const belowWidgets = [widget];
          for (const id of widget.content && widget.content.widgetIds
            ? widget.content.widgetIds
            : []) {
            const contentWidget = reordered.find((w) => w.id === id);
            if (contentWidget) {
              belowWidgets.push(contentWidget);
            }
          }
          for (let belowWidget of belowWidgets) {
            let firstIndex = index;
            let secondIndex = newIndex;
            let secondWidget = reordered[newIndex];
            while (belowWidget.order > parent.order) {
              // Swap widget with secondWidget
              let oldPosition = belowWidget.order;
              let newPosition = secondWidget.order;
              belowWidget.order = newPosition;
              secondWidget.order = oldPosition;

              reordered[secondIndex] = belowWidget;
              reordered[firstIndex] = secondWidget;

              firstIndex--;
              secondIndex--;
              belowWidget = reordered[firstIndex];
              secondWidget = reordered[secondIndex];
            }
            index++;
            newIndex++;
          }
        }
      } else {
        let parent = widgets.find((w) => w.id === neighbor.section);
        if (parent) {
          parent.content.widgetIds = [...parent.content.widgetIds, widget.id];
          widget.section = parent.id;
        }
      }
    } else {
      let first = index;
      while (first === index || reordered[first].section) {
        first++;
      }
      const belowWidgets = [reordered[first]];
      if (reordered[first].widgetType === WidgetType.Section) {
        for (const id of reordered[first].content.widgetIds) {
          const contentWidget = reordered.find((w) => w.id === id);
          if (contentWidget) {
            belowWidgets.push(contentWidget);
          }
        }
      }
      for (let belowWidget of belowWidgets) {
        let firstIndex = first;
        let secondIndex = first - 1;
        let secondWidget = reordered[first - 1];
        while (belowWidget.order > widget.order) {
          // Swap widget with neighbor
          let oldPosition = belowWidget.order;
          let newPosition = secondWidget.order;
          belowWidget.order = newPosition;
          secondWidget.order = oldPosition;

          reordered[secondIndex] = belowWidget;
          reordered[firstIndex] = secondWidget;

          firstIndex--;
          secondIndex--;
          belowWidget = reordered[firstIndex];
          secondWidget = reordered[secondIndex];
        }
        first++;
      }
    }
  }

  return reordered;
}

function moveMetric(
  metrics: Array<Metric>,
  index: number,
  newIndex: number
): Array<Metric> {
  // If new position is out of bounds, don't move anything.
  if (newIndex < 0 || newIndex >= metrics.length) {
    return metrics;
  }

  // Create a new metrics array so we don't modify the one
  // passed as parameter.
  const reordered = metrics.map((metric) => ({
    ...metric,
  }));

  const metric = reordered[index];
  const neighbor = reordered[newIndex];

  reordered[newIndex] = metric;
  reordered[index] = neighbor;

  return reordered;
}

const OrderingService = {
  moveWidget,
  moveMetric,
};

export default OrderingService;
