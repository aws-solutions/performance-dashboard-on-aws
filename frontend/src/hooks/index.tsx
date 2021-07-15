import {
  useDashboard,
  useDashboards,
  usePublicDashboard,
  useDashboardVersions,
  useDashboardHistory,
  useFriendlyUrl,
} from "./dashboard-hooks";
import { useWidget, useColors, useWidgetDataset } from "./widget-hooks";
import { useTopicAreas, useTopicArea } from "./topicarea-hooks";
import { useHomepage, usePublicHomepage } from "./homepage-hooks";
import { useSettings, usePublicSettings } from "./settings-hooks";
import { useJsonDataset, useSampleDataset } from "./dataset-hooks";
import { useUsers, useCurrentAuthenticatedUser } from "./user-hooks";
import { useDateTimeFormatter } from "./datetime-hooks";
import { useImage } from "./image-hooks";
import { useLogo } from "./logo-hooks";
import { useDatasets } from "./dataset-hooks";
import { useFullPreview } from "./dashboard-preview-hooks";
import {
  useYAxisMetadata,
  useXAxisMetadata,
  useWindowSize,
} from "./chart-hooks";
import { useTableMetadata } from "./table-hooks";
import { useChangeBackgroundColor } from "./background-hooks";
import { useScrollUp } from "./scrollup-hooks";

/**
 * No unit tests for custom hooks?
 *
 * Custom hooks cannot be tested in isolation because React enforces
 * the use of hooks only inside functional components. Invoking a
 * custom hook within a unit test results in an Invalid Hook Call Warning
 * https://reactjs.org/warnings/invalid-hook-call-warning.html.
 */

export {
  useDashboard,
  useDashboardHistory,
  usePublicDashboard,
  useDashboards,
  useWidget,
  useWidgetDataset,
  useColors,
  useTopicAreas,
  useTopicArea,
  usePublicHomepage,
  useHomepage,
  useSettings,
  usePublicSettings,
  useJsonDataset,
  useDashboardVersions,
  useSampleDataset,
  useDateTimeFormatter,
  useUsers,
  useCurrentAuthenticatedUser,
  useImage,
  useLogo,
  useFriendlyUrl,
  useDatasets,
  useFullPreview,
  useYAxisMetadata,
  useXAxisMetadata,
  useTableMetadata,
  useWindowSize,
  useChangeBackgroundColor,
  useScrollUp,
};
