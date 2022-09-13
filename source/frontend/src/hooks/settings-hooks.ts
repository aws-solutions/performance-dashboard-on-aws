import { useContext, useEffect } from "react";
import { Settings, PublicSettings } from "../models";
import { SettingsContext } from "../context/SettingsProvider";

type UseSettingsHook = {
  settings: Settings;
  reloadSettings: Function;
  loadingSettings: boolean;
};

export function useSettings(refetch?: boolean): UseSettingsHook {
  const { settings, reloadSettings, loadingSettings } =
    useContext(SettingsContext);

  useEffect(() => {
    if (refetch) {
      reloadSettings();
    }
  }, [refetch, reloadSettings]);

  return {
    settings: settings as Settings,
    reloadSettings,
    loadingSettings,
  };
}

type UsePublicSettingsHook = {
  settings: PublicSettings;
  reloadSettings: Function;
  loadingSettings: boolean;
};

export function usePublicSettings(refetch?: boolean): UsePublicSettingsHook {
  const { settings, reloadSettings, loadingSettings } =
    useContext(SettingsContext);

  useEffect(() => {
    if (refetch) {
      reloadSettings();
    }
  }, [refetch, reloadSettings]);

  return {
    settings: settings as PublicSettings,
    reloadSettings,
    loadingSettings,
  };
}
