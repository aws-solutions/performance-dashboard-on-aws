import React from "react";
import MainLayout from "../layouts/Main";
import { useDashboards, useHomepage } from "../hooks";

function Home() {
  const { dashboards } = useDashboards();
  const { homepage } = useHomepage();
  return (
    <MainLayout>
      <h1 className="font-sans-3xl width-tablet">{homepage.title}</h1>
      <p className="font-sans-lg measure-3 usa-prose">{homepage.description}</p>
      <ul className="usa-list">
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>{dashboard.name}</li>
        ))}
      </ul>
    </MainLayout>
  );
}

export default Home;
