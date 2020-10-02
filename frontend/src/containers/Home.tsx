import React from "react";
import dayjs from "dayjs";
import { useHomepage } from "../hooks";
import UtilsService from "../services/UtilsService";
import MainLayout from "../layouts/Main";
import Accordion from "../components/Accordion";
import Search from "../components/Search";

function Home() {
  const { homepage } = useHomepage();
  const topicareas = UtilsService.groupByTopicArea(homepage.dashboards);

  const onSearch = () => {
    console.log("Searching");
  };

  return (
    <MainLayout>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl">{homepage.title}</h1>
          <p className="font-sans-lg usa-prose">{homepage.description}</p>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8 padding-bottom-3">
          <Search id="search" onSubmit={onSearch} size="big" />
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
                      <a href="/dashboard">{dashboard.name}</a>
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
    </MainLayout>
  );
}

export default Home;
