/**
 * Useful mocks of our custom hook to make our unit
 * testing easier. Prevents the actual backend API
 * calls to happen and instead returns dummy data.
 */

const dummyDashboard = {
  id: "123",
  name: "My AWS Dashboard",
  topicAreaId: "abc",
  topicAreaName: "Bananas",
  description: "Some description",
  updatedAt: "",
  widgets: [
    {
      id: "abc",
      name: "Dummy text widget",
      widgetType: "Text",
      order: 0,
      updatedAt: "",
      content: { text: "test" },
    },
    {
      id: "xyz",
      name: "Dummy chart widget",
      widgetType: "Chart",
      order: 1,
      updatedAt: "",
      content: {},
    },
  ],
};

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
    draftsDashboards: [
      {
        id: "abc",
        name: "Dashboard One",
        topicAreaId: "123456789",
        topicAreaName: "Topic Area Bananas",
      },
    ],
    publishedDashboards: [
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
    reloadDashboard: jest.fn(),
    setDashboard: jest.fn(),
    dashboard: dummyDashboard,
  };
}

export function useWidget(
  dashboardId: string,
  widgetId: string,
  onWidgetFetched: Function
) {
  return {
    loading: false,
    widget: {
      id: "123",
      name: "Correlation of COVID cases to deaths",
      widgetType: "Text",
      order: 1,
      updatedAt: "",
      content: { text: "test" },
    },
  };
}

export function useWidgets(dashboardId: string) {
  return;
}

export function useHomepage() {
  return {
    loading: false,
    homepage: {
      title: "Kingdom of Wakanda",
      description: "Welcome to our dashboard",
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
    },
  };
}

export function usePublicDashboard(dashboardId: string) {
  return {
    loading: false,
    dashboard: dummyDashboard,
    reloadDashboard: jest.fn(),
  };
}
