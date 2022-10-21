/**
 * Useful mocks of our custom hook to make our unit
 * testing easier. Prevents the actual backend API
 * calls to happen and instead returns dummy data.
 */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  DashboardState,
  DatasetType,
  SourceType,
  DashboardAuditLog,
  Widget,
  Settings,
  PublicSettings,
} from "../../models";
import React from "react";

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
  const [settings] = useState<Settings>({
    dateTimeFormat: {
      date: "YYYY-MM-DD",
      time: "HH:mm",
    },
    publishingGuidance:
      "I acknowledge that I have reviewed the " +
      "dashboard and it is ready to publish",
    updatedAt: new Date("2020-12-08T22:56:13.721Z"),
    navbarTitle: "Performance Dashboard",
    colors: {
      primary: "#ffffff",
      secondary: "#0f6460",
    },
    topicAreaLabels: {
      singular: "Ministry",
      plural: "Ministries",
    },
    adminContactEmailAddress: "admin1@aol.com",
    contactEmailAddress: "contact@aol.com",
  });

  return {
    reloadSettings: jest.fn(),
    settings,
    loadingSettings: false,
  };
}

export function usePublicSettings() {
  const [settings] = useState<PublicSettings>({
    dateTimeFormat: {
      date: "YYYY-MM-DD",
      time: "HH:mm",
    },
    colors: {
      primary: "#ffffff",
      secondary: "#0f6460",
    },
    contactUsContent: "",
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
  const [dashboard] = useState(dummyDashboard);

  return {
    loading: false,
    reloadDashboard: jest.fn(),
    setDashboard: jest.fn(),
    dashboard,
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
    content: {
      text: "test",
      s3Key: {
        raw: "abc.jpeg",
      },
    },
  });

  const [currentJson] = useState([]);

  return {
    loading: false,
    currentJson,
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

export function useLogo(s3Key: string | undefined) {
  return {
    loadingFile: false,
    logo: undefined,
  };
}

export function useFavicon(s3Key: string | undefined) {
  return {
    loadingFile: false,
    logo: undefined,
  };
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

export function usePublicHomepageSearch(query: string) {
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
          queryMatches: ["Dashboard One"],
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
  const [jsonDataset] = useState({
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
  });
  return jsonDataset;
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
    {
      id: "456",
      fileName: "def",
      s3Key: {
        raw: "",
        json: "def.json",
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

  const [dynamicMetricDatasets] = useState([
    {
      id: "456",
      fileName: "def",
      s3Key: {
        raw: "",
        json: "def.json",
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
      createdBy: "andrew",
      updatedAt: "1/1/2000",
      sourceType: SourceType.FileUpload,
    },
  ]);

  return {
    loadingDatasets: false,
    datasets: datasets,
    dynamicDatasets: dynamicDatasets,
    dynamicMetricDatasets: dynamicMetricDatasets,
    staticDatasets: staticDatasets,
    reloadDatasets: jest.fn(),
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

export function useImage() {
  return {
    loading: false,
    file: {
      type: "image/png",
      name: "myphoto.png",
      size: 100,
    },
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
  dayjs.extend(utc);
  return useCallback((dateToDisplay: Date) => {
    return dayjs.utc(dateToDisplay).format("YYYY-MM-DD HH:mm");
  }, []);
}

export function useUsers() {
  const [users] = useState([
    {
      userId: "johndoe",
      email: "johndoe@example.com",
      status: "CONFIRMED",
      roles: ["Admin"],
    },
  ]);

  return {
    loading: false,
    users,
    reloadUsers: jest.fn(),
  };
}

export function useCurrentAuthenticatedUser() {
  const [username] = useState("johndoe");
  const [roles] = useState({
    isAdmin: true,
    isEditor: false,
    isPublisher: false,
  });

  return {
    username,
    isAdmin: roles.isAdmin,
    isEditor: roles.isEditor,
    isPublisher: roles.isPublisher,
    hasRole: true,
  };
}

export function useDashboardHistory() {
  const [loading] = useState(false);
  const [auditlogs] = useState<DashboardAuditLog[]>([
    {
      itemId: "001",
      timestamp: new Date("2020-12-08T22:56:13.721Z"),
      event: "Create",
      version: 1,
      userId: "johndoe",
    },
    {
      itemId: "001",
      timestamp: new Date("2020-12-09T00:10:10.600Z"),
      event: "Update",
      version: 1,
      userId: "johndoe",
      modifiedProperties: [
        {
          property: "state",
          oldValue: "Draft",
          newValue: "PublishPending",
        },
      ],
    },
  ]);
  return {
    loading,
    auditlogs,
  };
}

export function useWidgetDataset(widget: Widget) {
  const [loading] = useState<boolean>(false);
  const [jsonHeaders] = useState<string[]>(["City", "Jobs"]);
  const [json] = useState<any[]>([
    {
      City: "Seattle",
      Jobs: 300,
    },
    {
      City: "San Francisco",
      Jobs: 150,
    },
  ]);

  return {
    loading,
    json,
    jsonHeaders,
  };
}

export function useFriendlyUrl() {
  const [friendlyURL] = useState("/foo");
  return {
    friendlyURL,
  };
}

export function useFullPreview() {
  return {
    fullPreview: false,
    fullPreviewButton: <button type="button">Expand preview</button>,
  };
}

export function useYAxisMetadata() {
  const [yAxisLargestValue] = useState(100);
  const [yAxisMargin] = useState(0);
  return {
    yAxisLargestValue,
    yAxisMargin,
  };
}

export function useXAxisMetadata() {
  const [xAxisLargestValue] = useState(0);
  return {
    xAxisLargestValue,
  };
}

export function useTableMetadata() {
  const [largestTickByColumn] = useState({});
  return {
    largestTickByColumn,
  };
}

export function useWindowSize() {
  const [size] = useState({
    width: 1024,
    height: 768,
  });

  return size;
}

export function useChangeBackgroundColor() {}

export function useScrollUp(
  oldStep: number,
  step: number,
  setOldStep: Dispatch<SetStateAction<number>>
) {}

export function useFileLoaded(
  setToHide: Dispatch<SetStateAction<boolean>>,
  loadingFile: boolean,
  loadingSettings: boolean,
  settings: PublicSettings | Settings,
  logoOrFav: "logo" | "favicon"
) {
  // firstFileUpdate stops useEffect from executing after the first render
  // secondFileUpdate stops useEffect from executing when resource starts loading
  const firstFileUpdate = useRef(true);
  const secondFileUpdate = useRef(true);
  useEffect(() => {
    if (secondFileUpdate.current) {
      if (firstFileUpdate.current) {
        firstFileUpdate.current = false;
        return;
      }
      secondFileUpdate.current = false;
      return;
    }
    setToHide(false);
  }, [loadingFile]);

  // firstSettingsUpdate stops useEffect from executing after the first render
  // secondSettingsFileUpdate stops useEffect from executing when resource starts loading
  const firstSettingsUpdate = useRef(true);
  const secondSettingsUpdate = useRef(true);
  useEffect(() => {
    if (secondSettingsUpdate.current) {
      if (firstSettingsUpdate.current) {
        firstSettingsUpdate.current = false;
        return;
      }
      secondSettingsUpdate.current = false;
      return;
    }

    if (logoOrFav === "logo" && settings.customLogoS3Key === undefined) {
      setToHide(false);
    }

    if (logoOrFav === "favicon" && settings.customFaviconS3Key === undefined) {
      setToHide(false);
    }
  }, [loadingSettings]);
}
