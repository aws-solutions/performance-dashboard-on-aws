import { useEffect, useState, useCallback } from "react";
import { DatasetType, Widget, WidgetType } from "../models";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";

type UseWidgetHook = {
  loading: boolean;
  widget?: Widget;
  json: Array<any>;
  datasetType: DatasetType | undefined;
  setDatasetType: Function;
  setJson: Function;
  setWidget: Function;
};

export function useWidget(
  dashboardId: string,
  widgetId: string
): UseWidgetHook {
  const [loading, setLoading] = useState(false);
  const [widget, setWidget] = useState<Widget | undefined>(undefined);
  const [json, setJson] = useState<Array<any>>([]);
  const [datasetType, setDatasetType] = useState<DatasetType | undefined>(
    undefined
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BackendService.fetchWidgetById(dashboardId, widgetId);
    setWidget(data);

    if (
      data.widgetType === WidgetType.Chart ||
      data.widgetType === WidgetType.Table
    ) {
      const { s3Key, datasetType } = data.content;
      if (s3Key.json) {
        const dataset = await StorageService.downloadJson(s3Key.json);
        setJson(dataset);
      }
      if (datasetType) {
        setDatasetType(datasetType as DatasetType);
      } else {
        setDatasetType(DatasetType.CsvFileUpload);
      }
    }
    setLoading(false);
  }, [dashboardId, widgetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    widget,
    json,
    datasetType,
    setDatasetType,
    setJson,
    setWidget,
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
