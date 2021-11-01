import {
  SectionWidget,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import { WidgetBuilder, WidgetContentBuilder } from "./widget-builder";

export class SectionContentBuilder extends WidgetContentBuilder {
  private title?: string;
  private summary?: string;
  private showWithTabs?: boolean;
  private horizontally?: boolean;
  private widgets: WidgetBuilder[] = [];
  private dashboardId?: string;

  constructor() {
    super(WidgetType.Section);
  }

  withTitle(title: string) {
    this.title = title;
    return this;
  }

  withSummary(summary: string) {
    this.summary = summary;
    return this;
  }

  withShowWithTabs(showWithTabs: boolean) {
    this.showWithTabs = showWithTabs;
    return this;
  }

  withHorizontally(horizontally: boolean) {
    this.horizontally = horizontally;
    return this;
  }

  addWidget(widget: WidgetBuilder) {
    this.widgets.push(widget);
    return this;
  }

  setDashboardId(dashboardId: string): this {
    this.dashboardId = dashboardId;
    return this;
  }
  setOrder(order: number) {
    for (const widgetBuilder of this.widgets) {
      order = widgetBuilder.withOrder(order);
    }
    return order;
  }

  async build(widgetId: string) {
    if (!this.title) {
      throw new Error("Section title is required");
    }
    if (!this.dashboardId) {
      throw new Error("Section dashboardId is required");
    }

    const widgetIds: string[] = [];
    for (const widgetBuilder of this.widgets) {
      widgetBuilder.withSection(widgetId).withDashboardId(this.dashboardId);
      const widget = await widgetBuilder.build();
      widgetIds.push(widget.id);
    }

    const content: SectionWidget["content"] = {
      title: this.title,
      summary: this.summary,
      showWithTabs: this.showWithTabs || false,
      horizontally: this.horizontally || false,
      widgetIds: widgetIds,
    };
    return content;
  }
}
