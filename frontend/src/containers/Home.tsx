import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Link from "../components/Link";
import { usePublicHomepage, useDateTimeFormatter } from "../hooks";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import Accordion from "../components/Accordion";
import Search from "../components/Search";
import {
  PublicDashboard,
  LocationState,
  PublicTopicArea,
  Dashboard,
} from "../models";
import Spinner from "../components/Spinner";
import MarkdownRender from "../components/MarkdownRender";
import CardGroup from "../components/CardGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CalculateDuration } from "../hooks/datetime-hooks";
import "./Home.css";

function Home() {
  const { homepage, loading } = usePublicHomepage();
  const { t } = useTranslation();
  const dateFormatter = useDateTimeFormatter();
  const history = useHistory<LocationState>();
  const { Card, CardFooter, CardBody } = CardGroup;

  const onSearch = (query: string) => {
    history.push("/public/search?q=" + query);
  };

  const onClear = () => {
    history.push("/");
  };

  const topicareas = UtilsService.groupByTopicArea(homepage.dashboards);

  // Sort topic areas and their dashboards in ascending alphabetical order.
  topicareas.sort((a: PublicTopicArea, b: PublicTopicArea) =>
    a.name.localeCompare(b.name)
  );
  for (let topicArea of topicareas) {
    topicArea.dashboards?.sort((a: PublicDashboard, b: PublicDashboard) =>
      a.name.localeCompare(b.name)
    );
  }

  const getDashboardLink = (dashboard: PublicDashboard | Dashboard): string => {
    const link = dashboard.friendlyURL ? dashboard.friendlyURL : dashboard.id;
    return link;
  };

  return loading ? (
    <Spinner
      style={{
        position: "fixed",
        top: "30%",
        left: "50%",
      }}
      label={t("LoadingSpinnerLabel")}
    />
  ) : (
    <div className="usa-prose">
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl line-height-sans-2 margin-top-2">
            {homepage.title}
          </h1>
          <MarkdownRender
            className="font-sans-lg usa-prose"
            source={homepage.description}
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12 padding-y-3 usa-prose">
          <Search
            id="search"
            onSubmit={onSearch}
            size="big"
            onClear={onClear}
            query=""
            results={homepage.dashboards.length}
            wide
          />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12 usa-prose">
          <Accordion>
            {topicareas.map((topicarea) => (
              <Accordion.Item
                id={topicarea.id}
                key={topicarea.id}
                title={
                  topicarea.name + " (" + topicarea.dashboards?.length + ")"
                }
                hidden={true}
              >
                <div className="cards">
                  <ul>
                    {topicarea.dashboards
                      ? topicarea.dashboards.map((dashboard) => {
                          return (
                            <>
                              <Card
                                title={dashboard.name}
                                link={getDashboardLink(dashboard)}
                                col={4}
                              >
                                <CardBody>
                                  <p>
                                    <i>
                                      {CalculateDuration(
                                        dashboard.updatedAt,
                                        t
                                      )}
                                    </i>
                                    <br />
                                  </p>
                                </CardBody>
                                <CardFooter>
                                  <p key={dashboard.id}>
                                    <Link to={getDashboardLink(dashboard)}>
                                      <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="margin-right-1"
                                      />
                                    </Link>
                                  </p>
                                </CardFooter>
                              </Card>
                            </>
                          );
                        })
                      : ""}
                  </ul>
                </div>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default Home;
