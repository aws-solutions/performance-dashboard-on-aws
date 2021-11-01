import {
  ChartWidget,
  ImageWidget,
  MetricsWidget,
  SectionWidget,
  TableWidget,
  TextWidget,
  Widget,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import WidgetRepository from "performance-dashboard-backend/src/lib/repositories/widget-repo";
import { v4 as uuidv4 } from "uuid";

export type ContentType =
  | TextWidget["content"]
  | ChartWidget["content"]
  | TableWidget["content"]
  | ImageWidget["content"]
  | MetricsWidget["content"]
  | SectionWidget["content"];

export abstract class WidgetContentBuilder {
  constructor(readonly type: WidgetType) {}

  abstract build(widgetId: string): Promise<ContentType> | ContentType;

  setDashboardId(_dashboardId: string): this {
    return this;
  }
  setOrder(order: number) {
    return order;
  }
}

export class WidgetBuilder {
  private dashboardId?: string;
  private id?: string;
  private name?: string;
  private order: number = 0;
  private section?: string;
  private contentBuilder: WidgetContentBuilder | undefined;

  withDashboardId(dashboardId: string): WidgetBuilder {
    this.dashboardId = dashboardId;
    this.contentBuilder?.setDashboardId(dashboardId);
    return this;
  }

  withId(id: string) {
    this.id = id;
    return this;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  withOrder(order: number) {
    this.order = order;
    if (this.contentBuilder) {
      return this.contentBuilder.setOrder(order + 1);
    }
    return order + 1;
  }

  withSection(section: string) {
    this.section = section;
    return this;
  }

  withContent<T extends WidgetContentBuilder>(contentBuilder: T) {
    this.contentBuilder = contentBuilder;
    return this;
  }

  generateIdIf(flag: boolean): WidgetBuilder {
    if (flag) {
      this.withId(uuidv4());
    }
    return this;
  }

  async build(): Promise<Widget> {
    console.log("building widget: {}", this);
    if (!this.dashboardId) {
      throw new Error("dashboardId is required");
    }
    if (!this.id) {
      throw new Error("id is required");
    }
    if (!this.name) {
      throw new Error("name is required");
    }
    if (!this.contentBuilder) {
      throw new Error("contentBuilder is required");
    }
    const widget: Widget = {
      dashboardId: this.dashboardId,
      id: this.id,
      section: this.section,
      name: this.name,
      widgetType: this.contentBuilder.type,
      order: this.order || 0,
      updatedAt: new Date(),
      showTitle: true,
      content: await Promise.resolve(this.contentBuilder.build(this.id)),
    };
    await WidgetRepository.getInstance().saveWidget(widget);
    console.log("widget createdd");
    return widget;
  }
}
