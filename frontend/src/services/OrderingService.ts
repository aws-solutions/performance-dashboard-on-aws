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
  let destination = nodes[destinationIndex];
  nodes.splice(sourceIndex, 1);

  if (source.widget?.widgetType === WidgetType.Section) {
    // source is a section, so we need to move all its children
    if (destination?.widget?.widgetType === WidgetType.Section) {
      if (sourceIndex < destinationIndex) {
        // entering a section from top, move before the section
        const children = nodes.splice(sourceIndex, source.children.length);
        children.pop();
        nodes.splice(
          destinationIndex - children.length - 2,
          0,
          source,
          ...children
        );
      } else {
        // dropping section at the end of the section , insert before the section
        const children = nodes.splice(sourceIndex, source.children.length);
        children.pop();
        nodes.splice(destinationIndex, 0, source, ...children);
      }
    } else if (destination?.section && !!destination.widget) {
      // dropping inside a section, invalid move
      return undefined;
    } else {
      const children = nodes.splice(sourceIndex, source.children.length);
      children.pop();
      nodes.splice(
        sourceIndex < destinationIndex
          ? destinationIndex - children.length - 1
          : destinationIndex,
        0,
        source,
        ...children
      );
    }
  } else {
    // source is a single widget, so we need to move it
    if (destination?.widget?.widgetType === WidgetType.Section) {
      if (sourceIndex < destinationIndex) {
        // entering a section from top, move inside the section
        source.section = destination.id;
      } else {
        // dropping item in the section position, insert before the section
        source.section = "";
      }
    } else if (destination?.section && !destination.widget) {
      // entering or leaving a section from bottom
      if (sourceIndex < destinationIndex) {
        source.section = "";
      } else {
        source.section = destination.section;
      }
    } else if (destination?.section) {
      // moving inside a section
      if (
        source.widget?.widgetType === WidgetType.Section &&
        destination.section !== source.id
      ) {
        // invalid case, move section inside another
        return undefined;
      }
      source.section = destination.section;
    } else {
      // moving outside a section
      source.section = "";
    }

    nodes.splice(destinationIndex, 0, source);
  }

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
