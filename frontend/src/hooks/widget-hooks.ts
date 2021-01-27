import { useEffect, useState, useCallback } from "react";
import { DatasetType, Widget, WidgetType } from "../models";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";

type UseWidgetHook = {
  loading: boolean;
  widget?: Widget;
  datasetType: DatasetType | undefined;
  setDatasetType: Function;
  currentJson: Array<any>;
  dynamicJson: Array<any>;
  staticJson: Array<any>;
  csvJson: Array<any>;
  setCurrentJson: Function;
  setDynamicJson: Function;
  setStaticJson: Function;
  setCsvJson: Function;
  setWidget: Function;
};

export function useWidget(
  dashboardId: string,
  widgetId: string
): UseWidgetHook {
  const [loading, setLoading] = useState(false);
  const [widget, setWidget] = useState<Widget | undefined>(undefined);
  const [currentJson, setCurrentJson] = useState<Array<any>>([]);
  const [dynamicJson, setDynamicJson] = useState<Array<any>>([]);
  const [staticJson, setStaticJson] = useState<Array<any>>([]);
  const [csvJson, setCsvJson] = useState<Array<any>>([]);
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
        if (datasetType === DatasetType.DynamicDataset) {
          setDynamicJson(dataset);
        } else if (datasetType === DatasetType.StaticDataset) {
          setStaticJson(dataset);
        } else {
          setCsvJson(dataset);
        }
        setCurrentJson(dataset);
      }
      if (datasetType) {
        setDatasetType(datasetType as DatasetType);
      } else {
        setDatasetType(DatasetType.CsvFileUpload);
      }
    }

    if (data.widgetType === WidgetType.Metrics) {
      const { s3Key } = data.content;
      if (s3Key.json) {
        const dataset = await StorageService.downloadJson(s3Key.json);
        setCurrentJson(dataset);
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
    datasetType,
    setDatasetType,
    currentJson,
    dynamicJson,
    staticJson,
    csvJson,
    setCurrentJson,
    setDynamicJson,
    setStaticJson,
    setCsvJson,
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
