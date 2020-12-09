import React, { useEffect, useState, useCallback } from "react";
import { Hub } from "aws-amplify";
import { Settings } from "../models";
import BackendService from "../services/BackendService";

/**
 * Default settings to start with while we fetch the actual
 * Settings from the Backend.
 */
const defaultSettings: Settings = {
  publishingGuidance:
    "I acknowledge that I have reviewed the dashboard" +
    " and it is ready to publish",
};

interface SettingsContextProps {
  settings: Settings;
  reloadSettings: Function;
}

export const SettingsContext = React.createContext<SettingsContextProps>({
  reloadSettings: () => {},
  settings: defaultSettings,
});

/**
 * This provider wraps the root of our component's tree in <App />
 * to provide Settings to all the children components in the tree. It
 * uses React Context so that settings are kept in a global state instead
 * of fetching them over and over on every screen.
 */
function SettingsProvider(props: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsContextProps>({
    reloadSettings: () => {},
    settings: defaultSettings,
  });

  const fetchData = useCallback(async () => {
    try {
      const data = await BackendService.fetchSettings();
      setSettings({
        settings: data,
        reloadSettings: fetchData,
      });
    } catch (err) {
      console.log("Failed to load settings from backend");
    }
  }, []);

  /**
   * Listen for authentication events so that when users
   * signIn or their token is refreshed, we refetch the
   * Settings. This covers an edge case in which we fail
   * to fetch Settings the first time because the user was
   * not authenticated yet.
   */
  const listenAuthEvents = useCallback(
    (event: any) => {
      const { payload } = event;
      switch (payload.event) {
        case "signIn":
        case "tokenRefresh":
          fetchData();
          break;
        default:
          break;
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
    Hub.listen("auth", listenAuthEvents);
    return () => Hub.remove("auth", listenAuthEvents);
  }, [fetchData, listenAuthEvents]);

  return (
    <SettingsContext.Provider value={settings}>
      {props.children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
