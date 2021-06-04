import {
  Dashboard,
  DashboardState,
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

function validateEmails(input: string): boolean {
  const emails = input.split(",").map((email) => email.trim());
  return emails.every(emailIsValid);
}

function emailIsValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

function isCellEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

function getLargestHeader(headers: Array<string>, data?: Array<any>) {
  return (
    data
      ?.map((d) => (d as any)[headers.length ? headers[0] : ""] || "")
      .map((c) => c.toString().length)
      .reduce((a, b) => (a > b ? a : b), 0) || 0
  );
}

/**
 * Calculate the YAxis margin needed. This is important after we started
 * showing the ticks numbers as locale strings and commas or periods are being
 * added. Margin: Count the commas or periods in the largestTick to locale string
 * plus some extra margin, and multiply by pixelsByCharacter.
 */
function calculateYAxisMargin(
  largestTick: number,
  significantDigitLabels: boolean
): number {
  const pixelsByCharacter = significantDigitLabels ? 2 : 8;
  const tickLocaleString: string = largestTick.toLocaleString();
  const numberOfCommas: number =
    (tickLocaleString.match(/,|\./g)?.length || 0) + 3;
  return numberOfCommas * pixelsByCharacter;
}

/**
 * Given a dashboard, it returns the URL path of the screen
 * where the user should be redirected: /dashboard/edit/{id},
 * /dashboard/{id}, etc. This depends on the dashboard state.
 */
function getDashboardUrlPath(dashboard?: Dashboard) {
  if (!dashboard) return "/admin/dashboards";
  switch (dashboard.state) {
    case DashboardState.Draft:
      return `/admin/dashboard/edit/${dashboard.id}`;
    case DashboardState.PublishPending:
      return `/admin/dashboard/${dashboard.id}/publish`;
    case DashboardState.Archived:
      return `/admin/dashboard/${dashboard.id}`;
    case DashboardState.Published:
      return `/admin/dashboard/${dashboard.id}`;
    default:
      return "/admin/dashboards";
  }
}

function getTranslationUserStatusValue(userStatus: string) {
  let translationUserStatusValue = "";
  switch (userStatus) {
    case "UNCONFIRMED":
      translationUserStatusValue = "Unconfirmed";
      break;
    case "CONFIRMED":
      translationUserStatusValue = "Confirmed";
      break;
    case "ARCHIVED":
      translationUserStatusValue = "Archived";
      break;
    case "COMPROMISED":
      translationUserStatusValue = "Compromised";
      break;
    case "UNKNOWN":
      translationUserStatusValue = "Unknown";
      break;
    case "RESET_REQUIRED":
      translationUserStatusValue = "Reset_Required";
      break;
    case "FORCE_CHANGE_PASSWORD":
      translationUserStatusValue = "Force_Change_Password";
      break;
    default:
      translationUserStatusValue = userStatus;
      break;
  }
  return translationUserStatusValue;
}

const UtilsService = {
  groupByTopicArea,
  validateEmails,
  timeout,
  getLargestHeader,
  getDashboardUrlPath,
  calculateYAxisMargin,
  isCellEmpty,
  getTranslationUserStatusValue,
};

export default UtilsService;
