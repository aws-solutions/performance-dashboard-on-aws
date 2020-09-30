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
      <h1 className="font-sans-3xl width-tablet">{homepage.title}</h1>
      <p className="font-sans-lg measure-3 usa-prose">{homepage.description}</p>
      <div className="margin-y-4 width-mobile-lg">
        <Search id="search" onSubmit={onSearch} size="big" />
      </div>
      <div className="width-tablet">
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
    </MainLayout>
  );
}

export default Home;
