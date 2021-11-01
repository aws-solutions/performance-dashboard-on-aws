import {
  Dashboard,
  DashboardState,
} from "performance-dashboard-backend/src/lib/models/dashboard";
import { TopicArea } from "performance-dashboard-backend/src/lib/models/topicarea";
import DashboardRepository from "performance-dashboard-backend/src/lib/repositories/dashboard-repo";
import { v4 as uuidv4 } from "uuid";
import { WidgetBuilder } from "./widget-builder";

export class DashboardBuilder {
  private id: string | undefined;
  private version: number = 1;
  private parentId: string | undefined;
  private topicArea: TopicArea | undefined;
  private displayTableOfContents: boolean | undefined;
  private description: string | undefined;
  private author: string | undefined;
  private name: string | undefined;
  private widgets = new Map<WidgetBuilder, boolean>();

  withId(id: string): DashboardBuilder {
    this.id = id;
    return this;
  }

  withVersion(version: number): DashboardBuilder {
    this.version = version;
    return this;
  }

  withParentId(parentId: string): DashboardBuilder {
    this.parentId = parentId;
    return this;
  }

  withTopicArea(topicArea: TopicArea): DashboardBuilder {
    this.topicArea = topicArea;
    return this;
  }

  withDescription(description: string): DashboardBuilder {
    this.description = description;
    return this;
  }

  withAuthor(author: string): DashboardBuilder {
    this.author = author;
    return this;
  }

  withName(name: string): DashboardBuilder {
    this.name = name;
    return this;
  }

  addWidget(
    widget: WidgetBuilder,
    showTableOfContent: boolean = true
  ): DashboardBuilder {
    this.widgets.set(widget, showTableOfContent);
    return this;
  }

  withDisplayTableOfContents(
    displayTableOfContents: boolean
  ): DashboardBuilder {
    this.displayTableOfContents = displayTableOfContents;
    return this;
  }

  generateIdIf(flag: boolean): DashboardBuilder {
    if (flag) {
      this.withId(uuidv4());
    }
    return this;
  }

  async build(): Promise<Dashboard> {
    console.log("building dashboard: {}", this);
    if (!this.id) {
      throw new Error("id is required");
    }
    if (!this.topicArea) {
      throw new Error("topicArea is required");
    }
    if (!this.description) {
      throw new Error("description is required");
    }
    if (!this.author) {
      throw new Error("author is required");
    }
    if (!this.name) {
      throw new Error("name is required");
    }
    const dashboard: Dashboard = {
      id: this.id,
      version: this.version,
      parentDashboardId: this.parentId || this.id,
      topicAreaId: this.topicArea.id,
      topicAreaName: this.topicArea.name,
      displayTableOfContents: this.displayTableOfContents || true,
      description: this.description,
      name: this.name,
      createdBy: this.author,
      updatedBy: this.author,
      updatedAt: new Date(),
      state: DashboardState.Draft,
    };
    console.log("building dashboard: {}", dashboard);
    await DashboardRepository.getInstance().putDashboard(dashboard);
    console.log("dashboard created");

    console.log("adding widgets to dashboard...");
    const tableOfContents: { [widgetId: string]: boolean } = {};
    let order = 0;
    for (const [widgetBuilder, showTableOfContent] of this.widgets) {
      console.log(`> dashboard: ${this.id}`);
      console.log(`> order: ${order}`);
      widgetBuilder.withDashboardId(this.id);
      order = widgetBuilder.withOrder(order);

      const widget = await widgetBuilder.build();
      console.log("> widget added: {}", widget);

      tableOfContents[widget.id] = showTableOfContent;
    }

    // update table of contents
    dashboard.tableOfContents = tableOfContents;
    console.log("> udating table of content: {}", tableOfContents);
    await DashboardRepository.getInstance().putDashboard(dashboard);
    console.log("dashboard configured");

    return dashboard;
  }
}
