import {
  ChartType,
  Dashboard,
  PublicDashboard,
  PublicTopicArea,
} from "../models";

/**
 * Takes an array of dashboards and groups them by topic area.
 * Returns the list of topic areas, each with their corresponding
 * dashboards.
 */
function groupByTopicArea(
  dashboards: Array<Dashboard | PublicDashboard>
): Array<PublicTopicArea> {
  const byId: { [id: string]: PublicTopicArea } = {};
  dashboards.forEach((dashboard) => {
    let topicarea: PublicTopicArea;
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

function determineTopicAreaString(
  defaultTopicArea: string,
  currentTopicArea: string | undefined
): string {
  return `Topic areas ${
    currentTopicArea &&
    currentTopicArea.toLowerCase() === defaultTopicArea.toLowerCase()
      ? ""
      : ` (${currentTopicArea})`
  }`;
}

const UtilsService = {
  groupByTopicArea,
  getChartTypeLabel,
  determineTopicAreaString,
};

export default UtilsService;
