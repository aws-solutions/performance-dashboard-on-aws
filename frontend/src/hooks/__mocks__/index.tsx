/**
 * Useful mocks of our custom hook to make our unit
 * testing easier. Prevents the actual backend API
 * calls to happen and instead returns dummy data.
 */

export function useTopicAreas() {
  return {
    loading: false,
    topicareas: [
      {
        id: "123456789",
        name: "Topic Area Bananas",
      },
      {
        id: "987654321",
        name: "Topic Area Grapes",
      },
    ],
  };
}

export function useDashboards() {
  return {
    loading: false,
    dashboards: [
      {
        id: "abc",
        name: "Dashboard One",
        topicAreaId: "123456789",
        topicAreaName: "Topic Area Bananas",
      },
      {
        id: "xyz",
        name: "Dashboard Two",
        topicAreaId: "987654321",
        topicAreaName: "Topic Area Grapes",
      },
    ],
  };
}

export function useDashboard(dashboardId: string) {
  return {
    loading: false,
    dashboard: {
      id: "123",
      name: "My AWS Dashboard",
      topicAreaId: "abc",
      topicAreaName: "Bananas",
    },
  };
}

export function useWidgets(dashboardId: string) {
  return {
    loading: false,
    widgets: [
      {
        id: "123",
        name: "Correlation of COVID cases to deaths",
        widgetType: "Text",
      },
    ],
    setWidgets: () => {},
  };
}
