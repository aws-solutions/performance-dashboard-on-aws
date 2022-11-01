import { ItemNotFound, InvalidFriendlyURL } from "../errors";
import { Dashboard } from "../models/dashboard";
import DashboardRepository from "../repositories/dashboard-repo";

/**
 * If a friendlyURL is provided, it is validated and returned if valid. If no
 * fiendlyURL is provided, a new one will be auto generated based on the dashboard
 * name. On either scenario, it verifies that the URL is not being used already.
 *
 * @throws InvalidFriendlyURL
 */
async function generateOrValidate(
  dashboard: Dashboard,
  friendlyURL?: string
): Promise<string> {
  if (!friendlyURL) {
    // For backwards compatibility, if the request comes without a friendlyURL,
    // we generate one based on the dashboard name.
    friendlyURL = generateFriendlyURL(dashboard.name);
  } else {
    // If there is a friendlyURL provided by the user, validate it.
    if (!isValid(friendlyURL)) {
      throw new InvalidFriendlyURL(
        `The provided dashboard URL ${friendlyURL} is invalid`
      );
    }
  }

  if (!(await isFriendlyURLAvailable(dashboard, friendlyURL))) {
    throw new InvalidFriendlyURL(
      `The dashboard URL ${friendlyURL} is already being used`
    );
  }

  return friendlyURL;
}

function isValid(friendlyURL: string): boolean {
  if (!friendlyURL) return false;
  // Make sure URL does not contain RFC-3986 reserved characters
  return friendlyURL.match(/[!#$&'\(\)\*\+,\/:;=\?@\[\]]+/g) === null;
}

function generateFriendlyURL(dashboardName: string): string {
  return dashboardName
    .toLocaleLowerCase()
    .replace(/[!#$&'\(\)\*\+,\/:;=\?@\[\]-]+/g, " ") // replace RFC-3986 reserved characters and dashes with white spaces.
    .trim() // remove spaces from the beginning and the end.
    .replace(/\s+/g, "-") // replace spaces for dashes
    .replace(/-+/g, "-"); // convert consecutive dashes to singular dash
}

async function isFriendlyURLAvailable(
  dashboard: Dashboard,
  friendlyURL: string
) {
  if (friendlyURL.toLowerCase().trim() === "admin") {
    return false;
  }
  try {
    const repo = DashboardRepository.getInstance();
    const existingDashboard = await repo.getDashboardByFriendlyURL(friendlyURL);
    if (existingDashboard.parentDashboardId !== dashboard.parentDashboardId) {
      // The URL is already being used by another dashboard family
      return false;
    }
  } catch (err) {
    if (!(err instanceof ItemNotFound)) {
      throw err;
    }
  }
  return true;
}

export default {
  generateOrValidate,
  isValid,
  generateFriendlyURL,
};
