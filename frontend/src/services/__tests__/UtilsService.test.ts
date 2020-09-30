import { PublicDashboard } from "../../models";
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
