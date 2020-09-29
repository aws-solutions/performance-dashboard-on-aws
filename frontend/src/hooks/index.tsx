import { useEffect, useState, useCallback } from "react";
import { TopicArea, Dashboard, Widget } from "../models";
import BadgerService from "../services/BadgerService";
import StorageService from "../services/StorageService";

/**
 * No unit tests for custom hooks?
 *
 * Custom hooks cannot be tested in isolation because React enforces
 * the use of hooks only inside functional components. Invoking a
 * custom hook within a unit test results in an Invalid Hook Call Warning
 * https://reactjs.org/warnings/invalid-hook-call-warning.html.
 */

type UseTopicAreasHook = {
  loading: boolean;
  topicareas: Array<TopicArea>;
};

export function useTopicAreas(): UseTopicAreasHook {
  const [loading, setLoading] = useState(false);
  const [topicareas, setTopicAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchTopicAreas();
      setTopicAreas(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return {
    loading,
    topicareas,
  };
}

type UseDashboardHook = {
  loading: boolean;
  dashboard?: Dashboard;
  reloadDashboard: Function;
  setDashboard: Function;
};

export function useDashboard(dashboardId: string): UseDashboardHook {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BadgerService.fetchDashboardById(dashboardId);
    setLoading(false);
    if (data) {
      data.widgets.sort((a, b) => a.order - b.order);
      setDashboard(data);
    }
  }, [dashboardId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    dashboard,
    setDashboard,
    reloadDashboard: fetchData,
  };
}

type UseDashboardsHook = {
  loading: boolean;
  dashboards: Array<Dashboard>;
};

export function useDashboards(): UseDashboardsHook {
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchDashboards();
      setDashboards(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return {
    loading,
    dashboards,
  };
}

type UseWidgetHook = {
  loading: boolean;
  widget?: Widget;
};

export function useWidget(
  dashboardId: string,
  widgetId: string,
  onWidgetFetched: Function
): UseWidgetHook {
  const [loading, setLoading] = useState(false);
  const [widget, setWidget] = useState<Widget | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BadgerService.fetchWidgetById(dashboardId, widgetId);
    let fileDownloaded;
    if (data.widgetType === "Chart" || data.widgetType === "Table") {
      fileDownloaded = await StorageService.downloadDataset(
        data.content.s3Key.raw,
        data.content.title
      );
    }
    setLoading(false);
    if (data) {
      setWidget(data);
    }
    if (fileDownloaded && onWidgetFetched) {
      onWidgetFetched(fileDownloaded, data.name, data.content.chartType);
    } else if (onWidgetFetched) {
      onWidgetFetched(data.name, data.content.text);
    }
  }, [dashboardId, widgetId, onWidgetFetched]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    widget,
  };
}

export function useWidgets(
  widgets: Array<Widget>,
  onWidgetsFetched: Function
): void {
  const fetchData = useCallback(async () => {
    let filesDownloaded = new Array<{ widget: Widget; file: File }>();
    for (const widget of widgets) {
      if (widget.widgetType === "Chart" || widget.widgetType === "Table") {
        filesDownloaded.push({
          widget,
          file: await StorageService.downloadDataset(
            widget.content.s3Key.raw,
            widget.content.title
          ),
        });
      }
    }
    if (filesDownloaded.length && onWidgetsFetched) {
      onWidgetsFetched(filesDownloaded);
    }
  }, [widgets, onWidgetsFetched]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return;
}

const sprectrumColors = [
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

const getColors = (numberOfColors: number): Array<string> => {
  const colors = new Array<string>();
  for (let i = 0; i < numberOfColors; i++) {
    colors.push(sprectrumColors[i % sprectrumColors.length]);
  }
  return colors;
};

export function useColors(numberOfColors: number): Array<string> {
  const [colors, setColors] = useState<Array<string>>([]);

  useEffect(() => {
    setColors(getColors(numberOfColors));
  }, [numberOfColors]);

  return colors;
}
