import React, { useEffect, useState, useCallback } from "react";
import { Hub } from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import { Settings, PublicSettings } from "../models";
import BackendService from "../services/BackendService";

/**
 * Default settings to start with while we fetch the actual
 * Settings from the Backend.
 */
const defaultSettings: Settings = {
  dateTimeFormat: {
    date: "YYYY-MM-DD",
    time: "HH:mm",
  },
  publishingGuidance:
    "I acknowledge that I have reviewed the dashboard" +
    " and it is ready to publish",
  navbarTitle: "",
  topicAreaLabels: {
    singular: "Topic Area",
    plural: "Topic Areas",
  },
  customLogoS3Key: undefined,
  customFaviconS3Key: undefined,
  colors: {
    primary: "#005EA2",
    secondary: "#54278f",
  },
};

interface SettingsContextProps {
  settings: Settings | PublicSettings;
  reloadSettings: Function;
  loadingSettings: boolean;
}

export const SettingsContext = React.createContext<SettingsContextProps>({
  reloadSettings: () => {},
  settings: defaultSettings,
  loadingSettings: false,
});

/**
 * The settings reducer takes the settings object coming from the
 * backend and returns a Settings object containing those values
 * and fallbacks to default values for any missing field.
 *
 * This protects the frontend from crashing in the event where the
 * backend returns a Settings object that is missing certain fields.
 */
const settingsReducer = (backendSettings: Settings): Settings => {
  return {
    ...backendSettings, // add all values to start with
    // Check if we need to fallback to default values
    dateTimeFormat: backendSettings.dateTimeFormat
      ? backendSettings.dateTimeFormat
      : defaultSettings.dateTimeFormat,
    publishingGuidance: backendSettings.publishingGuidance
      ? backendSettings.publishingGuidance
      : defaultSettings.publishingGuidance,
  };
};

const publicSettingsReducer = (
  backendSettings: PublicSettings
): PublicSettings => {
  return {
    ...backendSettings, // add all values to start with
    // Check if we need to fallback to default values
    dateTimeFormat: backendSettings.dateTimeFormat
      ? backendSettings.dateTimeFormat
      : defaultSettings.dateTimeFormat,
  };
};

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
    loadingSettings: false,
  });

  const fetchSettings = useCallback(async (isUserAuthenticated: boolean) => {
    return isUserAuthenticated
      ? BackendService.fetchSettings()
      : BackendService.fetchPublicSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    let isUserAuthenticated: boolean;
    try {
      await Auth.currentSession();
      isUserAuthenticated = true;
    } catch (err) {
      isUserAuthenticated = false;
    }

    try {
      /**
       * useCallback is used because it is important that the
       * reloadSettings function does not change, because it
       * causes an infinite loop due to the settings-hook
       * having a useEffect on it.
       */
      setSettings({
        reloadSettings: loadSettings,
        settings: defaultSettings,
        loadingSettings: true,
      });

      const data = await fetchSettings(isUserAuthenticated);

      setSettings({
        settings: isUserAuthenticated
          ? settingsReducer(data)
          : publicSettingsReducer(data),
        reloadSettings: loadSettings,
        loadingSettings: false,
      });
    } catch (err) {
      console.log("Failed to load settings from backend");
      setSettings({
        reloadSettings: loadSettings,
        settings: defaultSettings,
        loadingSettings: false,
      });
    }
  }, [fetchSettings]);

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
          loadSettings();
          break;
        default:
          break;
      }
    },
    [loadSettings]
  );

  useEffect(() => {
    loadSettings();
    Hub.listen("auth", listenAuthEvents);
    return () => Hub.remove("auth", listenAuthEvents);
  }, [loadSettings, listenAuthEvents]);

  return (
    <SettingsContext.Provider value={settings}>
      {props.children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
