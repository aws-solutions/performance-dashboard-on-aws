import { Metric, Widget, WidgetType } from "../models";

export interface WidgetTreeItemData {
  id: string;
  dragIndex: number;
  label: string;
  children: WidgetTreeItemData[];
  /*
   * If not widget the node is a section end
   */
  widget?: Widget;
  section?: string;
}
export interface WidgetTreeData {
  map: { [key: number]: WidgetTreeItemData };
  nodes: Array<WidgetTreeItemData>;
}

function moveWidget(
  widgets: Array<Widget>,
  index: number,
  newIndex: number
): Array<Widget> {
  // If new position is out of bounds, don't move anything.
  if (newIndex < 0 || newIndex >= widgets.length) {
    if (newIndex == widgets.length && widgets[index].section) {
      const widgetsCopy = widgets.map((widget) => ({
        ...widget,
      }));
      let widget = widgetsCopy[index];
      let parent = widgetsCopy.find((w) => w.id === widget.section);
      if (parent) {
        widget.section = undefined;
        parent.content.widgetIds = parent.content.widgetIds.filter(
          (id: string) => id !== widget.id
        );
      }
      return widgetsCopy;
    }
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
      while (
        first < reordered.length &&
        (first === index || reordered[first].section)
      ) {
        first++;
      }
      if (first >= reordered.length) {
        return widgets;
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

function buildTree(widgets: Widget[]) {
  const data: WidgetTreeData = {
    map: {},
    nodes: [],
  };
  const sections: { [id: string]: WidgetTreeItemData } = {};

  widgets
    .filter((widget) => !widget.section)
    .forEach((widget, index) => {
      const node: WidgetTreeItemData = {
        id: widget.id,
        dragIndex: 0,
        label: (index + 1).toString(),
        children: [],
        widget: widget,
        section: "",
      };
      data.nodes.push(node);
      sections[widget.id] = node;
    });

  widgets
    .filter((widget) => widget.section)
    .forEach((widget) => {
      const parent = sections[widget.section ?? ""];
      const node: WidgetTreeItemData = {
        id: widget.id,
        dragIndex: 0,
        label: `${parent.label}.${parent.children.length + 1}`,
        children: [],
        widget: widget,
        section: widget.section,
      };
      parent.children.push(node);
    });

  let lastIndex = 0;
  data.nodes.forEach((node) => {
    node.dragIndex = lastIndex++;
    data.map[node.dragIndex] = node;

    node.children.forEach((child) => {
      child.dragIndex = lastIndex++;
      data.map[child.dragIndex] = child;
    });

    if (node.widget && node.widget.widgetType === WidgetType.Section) {
      const divider: WidgetTreeItemData = {
        id: `end-${node.id}`,
        dragIndex: lastIndex++,
        label: "",
        children: [],
        section: node.id,
      };
      node.children.push(divider);
    }
  });

  return data;
}

function mutateTree(
  tree: WidgetTreeData,
  sourceIndex: number,
  destinationIndex: number
): Widget[] | undefined {
  const nodes = tree.nodes.flatMap((node) => {
    const list = [node];
    if (node.widget?.widgetType === WidgetType.Section) {
      node.children.forEach((child) => {
        list.push(child);
      });
    }
    return list;
  });

  let source = nodes[sourceIndex];
  nodes.splice(sourceIndex, 1);
  const destination = nodes[destinationIndex];
  if (destination?.section) {
    if (
      source.widget?.widgetType === WidgetType.Section &&
      destination.section !== source.id
    ) {
      // invalid case, move section inside another
      return undefined;
    }
    source.section = destination.section;
  } else {
    source.section = "";
  }

  nodes.splice(destinationIndex, 0, source);

  const widgets: Widget[] = [];
  nodes.forEach((node) => {
    if (node.widget) {
      if (node.section !== node.widget.section) {
        node.widget = { ...node.widget, section: node.section };
      }
      widgets.push(node.widget);
    }
  });
  return widgets;
}

const OrderingService = {
  moveWidget,
  moveMetric,
  buildTree,
  mutateTree,
};

export default OrderingService;
