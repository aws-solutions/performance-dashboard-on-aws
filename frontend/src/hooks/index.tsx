import {
  useDashboard,
  useDashboards,
  usePublicDashboard,
} from "./dashboard-hooks";
import { useWidget, useWidgets, useColors } from "./widget-hooks";
import { useTopicAreas } from "./topicarea-hooks";
import { useHomepage } from "./homepage-hooks";

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
  useWidgets,
  useColors,
  useTopicAreas,
  useHomepage,
};
