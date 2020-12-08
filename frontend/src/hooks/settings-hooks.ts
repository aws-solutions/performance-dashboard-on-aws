import { useContext } from "react";
import { Settings } from "../models";
import { SettingsContext } from "../context/SettingsProvider";

type UseSettingsHook = {
  settings: Settings;
  reloadSettings: Function;
};

export function useSettings(): UseSettingsHook {
  const { settings, reloadSettings } = useContext(SettingsContext);

  return {
    settings,
    reloadSettings,
  };
}
