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
  length: number;
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
  const reordered = [...metrics];
  const source = reordered[index];
  reordered.splice(index, 1);
  reordered.splice(newIndex, 0, source);

  return reordered;
}

function buildTree(widgets: Widget[]) {
  const data: WidgetTreeData = {
    map: {},
    nodes: [],
    length: 0,
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

  data.length = lastIndex;
  return data;
}

function moveWidget(
  tree: WidgetTreeData,
  sourceIndex: number,
  destinationIndex: number
): Widget[] | undefined {
  if (sourceIndex === destinationIndex) {
    return undefined;
  }

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
  if (
    destinationIndex > sourceIndex &&
    destinationIndex < sourceIndex + source.children.length
  ) {
    return undefined;
  }

  const items = nodes.splice(sourceIndex, 1 + source.children.length);
  if (destinationIndex > sourceIndex) {
    destinationIndex -= source.children.length;
  }

  let destination = nodes[destinationIndex];
  if (destination) {
    // insert before the destination
    if (!!destination.section) {
      // if destination is a section, invalid movement
      if (source.widget?.widgetType === WidgetType.Section) {
        return undefined;
      } else {
        // assign the new section to the widget
        source.section = destination.section;
      }
    } else {
      source.section = "";
    }
  }

  // insert the items in the given position
  nodes.splice(destinationIndex, 0, ...items);

  // build the widget list
  const widgets: Widget[] = [];
  nodes.forEach((node) => {
    if (node.widget) {
      if (node.section !== node.widget.section) {
        node.widget = { ...node.widget, section: node.section };
      }
      widgets.push({ ...node.widget, order: widgets.length });
    }
  });
  return widgets;
}

const OrderingService = {
  moveWidget,
  moveMetric,
  buildTree,
};

export default OrderingService;
