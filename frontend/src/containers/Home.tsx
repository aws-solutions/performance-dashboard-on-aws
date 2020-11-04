import React, { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useHomepage } from "../hooks";
import UtilsService from "../services/UtilsService";
// import MainLayout from "../layouts/Main";
import Accordion from "../components/Accordion";
import Search from "../components/Search";
import { PublicDashboard } from "../models";

function Home() {
  const [filter, setFilter] = useState("");
  const { homepage, loading } = useHomepage();

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onClear = () => {
    setFilter("");
  };

  const filterPublicDashboards = (
    dashboards: Array<PublicDashboard>
  ): Array<PublicDashboard> => {
    return dashboards.filter((dashboard) => {
      const name = dashboard.name.toLowerCase().trim();
      const query = filter.toLowerCase();
      return name.includes(query);
    });
  };

  const topicareas = UtilsService.groupByTopicArea(
    filterPublicDashboards(homepage.dashboards)
  );

  if (loading) {
    return null;
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl">{homepage.title}</h1>
          <p className="font-sans-lg usa-prose">{homepage.description}</p>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8 padding-bottom-3">
          <Search
            id="search"
            onSubmit={onSearch}
            size="big"
            onClear={onClear}
            query={filter}
            results={filterPublicDashboards(homepage.dashboards).length}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <Accordion>
            {topicareas.map((topicarea) => (
              <Accordion.Item
                id={topicarea.id}
                key={topicarea.id}
                title={topicarea.name}
              >
                {topicarea.dashboards?.map((dashboard) => {
                  const updatedAt = dayjs(dashboard.updatedAt).format(
                    "YYYY-MM-DD hh:mm"
                  );
                  return (
                    <div
                      key={dashboard.id}
                      className="border-bottom border-base-light padding-2"
                    >
                      <Link to={`/${dashboard.id}`}>{dashboard.name}</Link>
                      <br />
                      <span className="text-base text-italic">
                        Last updated {updatedAt}
                      </span>
                    </div>
                  );
                })}
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default Home;
