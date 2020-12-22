/**
 * Useful mocks of our custom hook to make our unit
 * testing easier. Prevents the actual backend API
 * calls to happen and instead returns dummy data.
 */
import dayjs from "dayjs";
import { useState } from "react";
import { DashboardState, DatasetType, SourceType } from "../../models";

const dummyDashboard = {
  id: "123",
  name: "My AWS Dashboard",
  topicAreaId: "abc",
  topicAreaName: "Bananas",
  description: "Some description",
  updatedAt: "",
  createdBy: "test user",
  version: 1,
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
      content: {
        chartType: "LineChart",
        s3Key: {
          json: "xyz.json",
        },
      },
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
        createdBy: "test user 1",
        dashboardCount: 4,
      },
      {
        id: "987654321",
        name: "Topic Area Grapes",
        createdBy: "test user 2",
        dashboardCount: 10,
      },
    ],
  };
}

export function useSettings() {
  const [settings] = useState({
    dateTimeFormat: {
      date: "YYYY-MM-DD",
      time: "HH:mm",
    },
    publishingGuidance:
      "I acknowledge that I have reviewed the " +
      "dashboard and it is ready to publish",
    updatedAt: new Date("2020-12-08T22:56:13.721Z"),
  });

  return {
    reloadSettings: jest.fn(),
    settings,
    loadingSettings: false,
  };
}

export function usePublicSettings() {
  const [settings] = useState({
    dateTimeFormat: {
      date: "YYYY-MM-DD",
      time: "HH:mm",
    },
  });

  return {
    reloadSettings: jest.fn(),
    settings,
    loadingSettings: false,
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
        createdBy: "test user",
      },
      {
        id: "xyz",
        name: "Dashboard Two",
        topicAreaId: "987654321",
        topicAreaName: "Topic Area Grapes",
        createdBy: "test user",
      },
    ],
    draftsDashboards: [
      {
        id: "abc",
        name: "Dashboard One",
        topicAreaId: "123456789",
        topicAreaName: "Topic Area Bananas",
        createdBy: "test user",
      },
    ],
    publishedDashboards: [
      {
        id: "xyz",
        name: "Dashboard Two",
        topicAreaId: "987654321",
        topicAreaName: "Topic Area Grapes",
        createdBy: "test user",
      },
    ],
    pendingDashboards: [],
    archivedDashboards: [],
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
  const [widget] = useState({
    id: "123",
    name: "Correlation of COVID cases to deaths",
    datasetType: DatasetType.DynamicDataset,
    widgetType: "Text",
    order: 1,
    updatedAt: "",
    content: { text: "test" },
  });

  return {
    loading: false,
    currentJson: [],
    dynamicJson: [],
    staticJson: [],
    csvJson: [],
    setCurrentJson: jest.fn(),
    setDynamicJson: jest.fn(),
    setStaticJson: jest.fn(),
    setCsvJson: jest.fn(),
    setWidget: jest.fn(),
    setDatasetType: jest.fn(),
    datasetType: DatasetType.DynamicDataset,
    widget: widget,
  };
}

export function useWidgets(dashboardId: string) {
  return;
}

export function usePublicHomepage() {
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

export function useHomepage() {
  return {
    loading: false,
    homepage: {
      title: "Kingdom of Wakanda",
      description: "Welcome to our dashboard",
      updatedAt: "",
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

export function useJsonDataset(s3Key: string) {
  return {
    loading: false,
    json: [
      {
        City: "Seattle",
        Jobs: 300,
      },
      {
        City: "San Francisco",
        Jobs: 150,
      },
    ],
  };
}

export function useDatasets() {
  const [datasets] = useState([
    {
      id: "123",
      fileName: "abc",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      sourceType: SourceType.FileUpload,
    },
    {
      id: "123",
      fileName: "abc",
      s3Key: {
        raw: "",
        json: "abc.json",
      },
      sourceType: SourceType.IngestApi,
    },
  ]);

  const [dynamicDatasets] = useState([
    {
      id: "123",
      fileName: "abc",
      s3Key: {
        raw: "",
        json: "abc.json",
      },
      sourceType: SourceType.IngestApi,
    },
  ]);

  const [staticDatasets] = useState([
    {
      id: "123",
      fileName: "abc",
      s3Key: {
        raw: "abc.csv",
        json: "abc.json",
      },
      sourceType: SourceType.FileUpload,
    },
  ]);

  return {
    loadingDatasets: false,
    datasets: datasets,
    dynamicDatasets: dynamicDatasets,
    staticDatasets: staticDatasets,
    reloadDatasets: jest.fn(),
  };
}

export function useAdmin() {
  return {
    username: "johndoe",
  };
}

export function useColors(numberOfColors: number) {
  return [
    "#29B4BB",
    "#3F29C8",
    "#E17316",
    "#CE167E",
    "#7D70F9",
    "#40E15D",
    "#2168E5",
    "#5B20A2",
    "#D7B40A",
    "#BE5B0F",
    "#217C59",
    "#8DED43",
  ];
}

export function useDashboardVersions(parentDashboardId: string) {
  return {
    loading: false,
    versions: [
      {
        id: "001",
        version: 1,
        state: DashboardState.Draft,
      },
      {
        id: "002",
        version: 2,
        state: DashboardState.Published,
      },
    ],
  };
}

export function useSampleDataset() {
  return {
    loading: false,
    dataset: {
      data: [],
      headers: [],
    },
  };
}

export function useTopicArea() {
  return {
    loading: false,
    topicarea: {
      id: "123456789",
      name: "Health Topic",
      createdBy: "johndoe",
    },
  };
}

export function useDateTimeFormatter() {
  return (dateToDisplay: Date) => {
    return dayjs(dateToDisplay).format("YYYY-MM-DD HH:mm");
  };
}
