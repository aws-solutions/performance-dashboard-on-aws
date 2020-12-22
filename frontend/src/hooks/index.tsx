import {
  useDashboard,
  useDashboards,
  usePublicDashboard,
  useDashboardVersions,
} from "./dashboard-hooks";
import { useWidget, useColors } from "./widget-hooks";
import { useTopicAreas, useTopicArea } from "./topicarea-hooks";
import { useHomepage, usePublicHomepage } from "./homepage-hooks";
import { useSettings, usePublicSettings } from "./settings-hooks";
import { useJsonDataset, useSampleDataset } from "./dataset-hooks";
import { useAdmin } from "./admin-hooks";
import { useDateTimeFormatter } from "./datetime-hooks";

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
  usePublicDashboard,
  useDashboards,
  useWidget,
  useColors,
  useTopicAreas,
  useTopicArea,
  usePublicHomepage,
  useHomepage,
  useSettings,
  usePublicSettings,
  useJsonDataset,
  useAdmin,
  useDashboardVersions,
  useSampleDataset,
  useDateTimeFormatter,
};
