import { useEffect, useState } from "react";
import { Settings } from "../models";
import BackendService from "../services/BackendService";

type UseSettingsHook = {
  loadingSettings: boolean;
  settings: Settings;
};

export function useSettings(): UseSettingsHook {
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    publishingGuidance: "",
    updatedAt: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSettings(true);
      const data = await BackendService.fetchSettings();
      setSettings(data);
      setLoadingSettings(false);
    };
    fetchData();
  }, []);

  return {
    loadingSettings,
    settings,
  };
}
