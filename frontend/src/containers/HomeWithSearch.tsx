import React, { useHistory } from "react-router-dom";
import Link from "../components/Link";
import { useDateTimeFormatter, usePublicHomepageSearch } from "../hooks";
import { useTranslation } from "react-i18next";
import UtilsService from "../services/UtilsService";
import Accordion from "../components/Accordion";
import Search from "../components/Search";
import { PublicHomepage, LocationState } from "../models";
import Spinner from "../components/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function HomeWithSearch() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const { homepage, loading } = usePublicHomepageSearch(query as string);
  const { t } = useTranslation();
  const dateFormatter = useDateTimeFormatter();
  const history = useHistory<LocationState>();

  const topicareas = UtilsService.groupByTopicArea(homepage.dashboards);

  const onSearch = (query: string) => {
    if (query == undefined || query == "") {
      history.push("/");
    } else {
      history.push("/public/search?q=" + query);
    }
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
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} /> {t("AllDashboardsLink")}
      </Link>
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl line-height-sans-2 margin-top-2">
            {t("Search.SearchResults")}
          </h1>
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
            lastQuery={query ? query : undefined}
          />
          {homepage.dashboards.length} dashboard(s) contain "{query}". &ensp;
          {query === "" ? t("Search.EnterSearchTerm") + "." : ""}
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
                    <li key={dashboard.id} style={{ listStyleType: "none" }}>
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
                    </li>
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
