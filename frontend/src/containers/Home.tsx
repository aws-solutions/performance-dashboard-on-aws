import React from "react";
import MainLayout from "../layouts/Main";
import { useDashboards } from "../hooks";

function Home() {
  const { dashboards } = useDashboards();
  return (
    <MainLayout>
      <h1>Dashboards</h1>
      <ul className="usa-list">
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>{dashboard.name}</li>
        ))}
      </ul>
    </MainLayout>
  );
}

export default Home;
