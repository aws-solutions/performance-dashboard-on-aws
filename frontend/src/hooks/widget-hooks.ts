import { useEffect, useState, useCallback } from "react";
import { Widget } from "../models";
import BadgerService from "../services/BadgerService";
import StorageService from "../services/StorageService";

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

type UseWidgetsHook = {
  loading: boolean;
  widgets: Array<Widget>;
  setWidgets: Function;
};

export function useWidgets(dashboardId: string): UseWidgetsHook {
  const [loading, setLoading] = useState(false);
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchWidgets(dashboardId);
      setWidgets(data);
      setLoading(false);
    };
    fetchData();
  }, [dashboardId]);

  return {
    loading,
    widgets,
    setWidgets,
  };
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
