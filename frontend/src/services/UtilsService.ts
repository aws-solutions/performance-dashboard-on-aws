/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import {
  Dashboard,
  DashboardState,
  Dataset,
  DatasetType,
  PublicDashboard,
  PublicTopicArea,
  LocationState,
} from "../models";
import RulerService from "./RulerService";

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

/**
 * The most effective method consists in checking for @-sign somewhere in the email address.
 * Then sending a verification email to given email address.
 * If the end user can follow the validation instructions in the email message, the email address is correct.
 * @param email
 * @returns boolean
 */
function emailIsValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+$/.test(email);
}

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

function isCellEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

function getLabels(headers: Array<string>, data?: Array<any>) {
  return data?.map((d) => d[headers.length ? headers[0] : ""] || "");
}

function getLargestHeader(headers: Array<string>, data?: Array<any>) {
  return (
    getLabels(headers, data)
      ?.map((c) => c.length)
      .reduce((a, b) => Math.max(a, b), 0) || 0
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
    (tickLocaleString.match(/[,\.]/g)?.length || 0) + 3;
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

function calculateBarDimentions(
  container: Element,
  stacked: boolean,
  headers: string[],
  data?: any[],
  maxLabelWidth?: number,
  barSize?: number
): ComputedDimensions {
  const style = container ? window.getComputedStyle(container) : undefined;
  if (!maxLabelWidth) {
    maxLabelWidth = container ? 0.3 * container.clientWidth : 200;
  }
  if (!barSize) {
    barSize = 32;
  }
  const cols = stacked ? 2 : Math.max(headers.length - 1, 1);
  const labels = getLabels(headers, data) || [];
  const labelWidth = Math.min(
    labels
      .map((c) => RulerService.getVisualWidth(c, style?.font, style?.fontSize))
      .reduce((a, b) => Math.max(a, b), 0) + RulerService.getVisualWidth("M"),
    maxLabelWidth
  );

  return {
    labelWidth,
    chartHeight: cols * Math.max(labels.length, 1) * barSize,
  };
}

function getShorterId(id: string) {
  return id?.substring(0, 8);
}

function getSortData(
  columnName: string | undefined,
  isDescending: boolean | undefined
): string {
  if (!columnName) {
    return "";
  }
  return `${columnName}###${isDescending ? "desc" : "asc"}`;
}

function getDatasetPropertyByDatasetType(
  datasetType: DatasetType | undefined,
  propertyName: string,
  dynamicDataset: Dataset | undefined,
  staticDataset: Dataset | undefined
): any {
  const propertyAccessor = propertyName as keyof Dataset;
  return datasetType === DatasetType.DynamicDataset
    ? dynamicDataset && dynamicDataset[propertyAccessor]
    : staticDataset && staticDataset[propertyAccessor];
}

function getDatasetTypeFromState(
  state: LocationState | undefined,
  fallbackValue: DatasetType | undefined
): DatasetType | undefined {
  if (state && state.json) {
    return DatasetType.StaticDataset;
  }
  return fallbackValue;
}

/**
 * Calculate the width percent out of the total width
 * depending on the container. Width: (largestHeader + 1) *
 * headersCount * pixelsByCharacter + marginLeft + marginRight
 * @param props { data?: Array<any>; headers: Array<string>; isPreview?: boolean }
 * @param pixelsByCharacter number
 * @param marginLeft number
 * @param marginRight number
 * @param previewWidth number
 * @param fullWidth number
 * @returns number
 */
function computeChartWidgetWidthPercent(
  props: { data?: Array<any>; headers: Array<string>; isPreview?: boolean },
  pixelsByCharacter: number = 8,
  marginLeft: number = 50,
  marginRight: number = 50,
  previewWidth: number = 480,
  fullWidth: number = 960
): number {
  const { data, headers, isPreview } = props;
  const largestHeader = UtilsService.getLargestHeader(headers, data);
  const headersCount = data ? data.length : 0;
  const actualWidth =
    (largestHeader + 1) * headersCount * pixelsByCharacter +
    marginLeft +
    marginRight;
  const totalWidth = isPreview ? previewWidth : fullWidth;
  return (actualWidth * 100) / totalWidth;
}

export interface ComputedDimensions {
  labelWidth: number;
  chartHeight: number;
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
  calculateBarDimentions,
  getShorterId,
  getSortData,
  getDatasetPropertyByDatasetType,
  getDatasetTypeFromState,
  computeChartWidgetWidthPercent,
};

export default UtilsService;
