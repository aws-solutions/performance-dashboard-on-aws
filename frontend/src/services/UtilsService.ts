import { ChartType, Dashboard, PublicDashboard, TopicArea } from "../models";

/**
 * Takes an array of dashboards and groups them by topic area.
 * Returns the list of topic areas, each with their corresponding
 * dashboards.
 */
function groupByTopicArea(
  dashboards: Array<Dashboard | PublicDashboard>
): Array<TopicArea> {
  const byId: { [id: string]: TopicArea } = {};
  dashboards.forEach((dashboard) => {
    let topicarea: TopicArea;
    const id = dashboard.topicAreaId;
    if (byId[id]) {
      topicarea = byId[id];
      topicarea.dashboards?.push(dashboard);
    } else {
      topicarea = {
        id,
        name: dashboard.topicAreaName,
        dashboards: [dashboard],
      };
    }
    byId[id] = topicarea;
  });
  return Object.values(byId);
}

function getChartTypeLabel(chartType: string): string {
  return chartType === ChartType.PartWholeChart
    ? "Part-to-whole Chart"
    : chartType.split(/(?=[A-Z])/).join(" ");
}

export default {
  groupByTopicArea,
  getChartTypeLabel,
};
