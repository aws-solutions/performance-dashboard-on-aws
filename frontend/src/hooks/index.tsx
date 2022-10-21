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
import {
  useHomepage,
  usePublicHomepage,
  usePublicHomepageSearch,
} from "./homepage-hooks";
import { useSettings, usePublicSettings } from "./settings-hooks";
import { useDatasets, useJsonDataset, useSampleDataset } from "./dataset-hooks";
import { useUsers, useCurrentAuthenticatedUser } from "./user-hooks";
import { useDateTimeFormatter } from "./datetime-hooks";
import { useImage } from "./image-hooks";
import { useLogo } from "./logo-hooks";
import { useFavicon } from "./favicon-hooks";
import { useFullPreview } from "./dashboard-preview-hooks";
import {
  useYAxisMetadata,
  useXAxisMetadata,
  useWindowSize,
} from "./chart-hooks";
import { useTableMetadata } from "./table-hooks";
import { useChangeBackgroundColor } from "./background-hooks";
import { useScrollUp } from "./scrollup-hooks";
import { useFileLoaded } from "./file-loaded-hooks";

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
  usePublicHomepageSearch,
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
  useFavicon,
  useFriendlyUrl,
  useDatasets,
  useFullPreview,
  useYAxisMetadata,
  useXAxisMetadata,
  useTableMetadata,
  useWindowSize,
  useChangeBackgroundColor,
  useScrollUp,
  useFileLoaded,
};
