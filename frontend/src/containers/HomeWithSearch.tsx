import React, { useHistory } from "react-router-dom";
import Link from "../components/Link";
import { useDateTimeFormatter, usePublicHomepageSearch } from "../hooks";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import Accordion from "../components/Accordion";
import Search from "../components/Search";
import { PublicHomepage, LocationState } from "../models";
import Spinner from "../components/Spinner";
import MarkdownRender from "../components/MarkdownRender";
import "./Home.css";

interface QueryParams {
  q: string;
}

function HomeWithSearch() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const { homepage, loading } = usePublicHomepageSearch(query as string);
  const { t } = useTranslation();
  const dateFormatter = useDateTimeFormatter();
  const history = useHistory<LocationState>();

  const topicareas = UtilsService.groupByTopicArea(homepage.dashboards);

  const onSearch = (query: string) => {
    history.push("/public/search?q=" + query);
  };

  const onClear = () => {
    history.push("/");
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
        <div className="grid-col-12 tablet:grid-col-8 padding-y-3 usa-prose">
          <Search
            id="search"
            onSubmit={onSearch}
            onClear={onClear}
            size="big"
            query=""
            results={homepage.dashboards.length}
          />
          {homepage.dashboards.length} dashboard(s) contain "{query}" &emsp;
          <Link to={`/`}>{t("ClearSearchText")}</Link>
          <br />
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8 usa-prose">
          <Accordion>
            {topicareas.map((topicarea) => (
              <Accordion.Item
                id={topicarea.id}
                key={topicarea.id}
                title={topicarea.name}
              >
                {topicarea.dashboards?.map((dashboard) => {
                  const updatedAt = dateFormatter(dashboard.updatedAt);
                  return (
                    <div
                      key={dashboard.id}
                      className="border-bottom border-base-light padding-2"
                    >
                      {dashboard.friendlyURL ? (
                        <Link to={`/${dashboard.friendlyURL}`}>
                          {dashboard.name}
                        </Link>
                      ) : (
                        // If dashboard doesn't have a friendlyURL, use the dashboardId.
                        <Link to={`/${dashboard.id}`}>{dashboard.name}</Link>
                      )}
                      <br />
                      <span className="text-base text-italic">
                        {t("LastUpdatedLabel")} {updatedAt}
                        <br />
                      </span>
                      {dashboard.queryMatches?.map((queryMatch) => {
                        return (
                          <p
                            key={queryMatch}
                            className="text-base margin-left-2 margin-right-2"
                          >
                            {" "}
                            ... {queryMatch} ...
                            <br />
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default HomeWithSearch;
