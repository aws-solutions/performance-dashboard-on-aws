import { useEffect, useState } from "react";
import { TopicArea, Dashboard, Widget } from "../models";
import BadgerService from "../services/BadgerService";

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
  setDashboard: Function;
};

export function useDashboard(dashboardId: string): UseDashboardHook {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await BadgerService.fetchDashboardById(dashboardId);
      setDashboard(data);
      setLoading(false);
    };
    fetchData();
  }, [dashboardId]);

  return {
    loading,
    dashboard,
    setDashboard,
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

const getRandomColor = () => {
  let randomColor = `${Math.floor(Math.random() * 65535).toString(16).padEnd(4, "0")}`;
  const randomPosition = Math.floor(Math.random()*3) * 2;
  randomColor = `#${randomColor.substring(0, randomPosition)}00${randomColor.substring(randomPosition)}`;
  return randomColor;
};

const getRandomColors = (numberOfColors: number): Array<string> => {
  const randomColors = new Array<string>();
  for (let i = 0; i < numberOfColors; i++) {
    randomColors.push(getRandomColor());
  }
  return randomColors;
};

export function useColors(numberOfColors: number): Array<string> {
  const [colors, setColors] = useState<Array<string>>([]);

  useEffect(() => {
    setColors(getRandomColors(numberOfColors));
  }, [numberOfColors]);

  return colors;
}