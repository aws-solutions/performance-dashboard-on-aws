import { useEffect, useState, useCallback } from "react";
import { DatasetType, Widget, WidgetType } from "../models";
import BackendService from "../services/BackendService";
import StorageService from "../services/StorageService";
import ColorPaletteService from "../services/ColorPaletteService";
import { useSettings } from "./settings-hooks";

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

export function useColors(
  numberOfColors: number,
  primaryColor?: string,
  secondaryColor?: string
): Array<string> {
  const { settings } = useSettings();
  const [colors, setColors] = useState<Array<string>>([]);

  useEffect(() => {
    if (settings && settings.colors) {
      setColors(
        ColorPaletteService.getColors(
          numberOfColors,
          primaryColor || settings.colors.primary,
          secondaryColor || settings.colors.secondary
        )
      );
    }
  }, [settings, numberOfColors, primaryColor, secondaryColor]);

  return colors;
}
