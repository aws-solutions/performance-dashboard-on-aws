import { Dashboard, DashboardState, PublicDashboard } from "../../models";
import UtilsService from "../UtilsService";

describe("groupByTopicArea", () => {
  test("returns empty array given empty list of dashboards", () => {
    expect(UtilsService.groupByTopicArea([])).toEqual([]);
  });

  test("returns a list of topic areas with dashboards", () => {
    const dashboard1: PublicDashboard = {
      id: "123",
      name: "Banana",
      topicAreaId: "xyz",
      topicAreaName: "Fruits",
      updatedAt: new Date(),
      widgets: [],
    };

    const dashboard2: PublicDashboard = {
      id: "456",
      name: "Cilantro",
      topicAreaId: "abc",
      topicAreaName: "Vegetables",
      updatedAt: new Date(),
      widgets: [],
    };

    const topicareas = UtilsService.groupByTopicArea([dashboard1, dashboard2]);
    expect(topicareas.length).toEqual(2);

    const topicarea1 = topicareas.find((topicarea) => topicarea.id === "xyz");
    expect(topicarea1).toBeDefined();
    expect(topicarea1?.dashboards).toContain(dashboard1);

    const topicarea2 = topicareas.find((topicarea) => topicarea.id === "abc");
    expect(topicarea2).toBeDefined();
    expect(topicarea2?.dashboards).toContain(dashboard2);
  });
});

describe("getDashboardUrlPath", () => {
  const dashboard = {
    id: "001",
  } as Dashboard;

  test("returns the url to EditDashboard for a dashboard in Draft", () => {
    dashboard.state = DashboardState.Draft;
    const path = UtilsService.getDashboardUrlPath(dashboard);
    expect(path).toEqual("/admin/dashboard/edit/001");
  });

  test("returns the url to the PublishWorkflow for a dashboard in PublishPending", () => {
    dashboard.state = DashboardState.PublishPending;
    const path = UtilsService.getDashboardUrlPath(dashboard);
    expect(path).toEqual("/admin/dashboard/001/publish");
  });

  test("returns the url to ViewDashboard for a Published dashboard", () => {
    dashboard.state = DashboardState.Published;
    const path = UtilsService.getDashboardUrlPath(dashboard);
    expect(path).toEqual("/admin/dashboard/001");
  });

  test("returns the url to ArchivedDashboard for an archived dashboard", () => {
    dashboard.state = DashboardState.Archived;
    const path = UtilsService.getDashboardUrlPath(dashboard);
    expect(path).toEqual("/admin/dashboard/001");
  });
});
