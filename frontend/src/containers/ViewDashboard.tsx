import React, { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { parse } from "papaparse";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePublicDashboard, useWidgets } from "../hooks";
import { Widget } from "../models";
import MainLayout from "../layouts/Main";
import WidgetRender from "../components/WidgetRender";

interface PathParams {
  dashboardId: string;
}

function ViewDashboard() {
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = usePublicDashboard(dashboardId);
  const [allFilesProcessed, setAllFilesProcessed] = useState<boolean>(false);

  const onFilesProcessed = useCallback(
    async (files: Array<{ widget: Widget; file: File }>) => {
      if (!files) {
        return;
      }

      Promise.all(
        [...files].map(
          (file) =>
            new Promise((resolve, reject) => {
              return {
                data: parse(file.file, {
                  header: true,
                  dynamicTyping: true,
                  skipEmptyLines: true,
                  comments: "#",
                  complete: (results) => {
                    file.widget.content.data = results.data;
                    resolve(results);
                  },
                  error: reject,
                }),
              };
            })
        )
      )
        .then(() => {
          setAllFilesProcessed(true);
        })
        .catch((err) => {
          console.log("Something went wrong:", err);
        });
    },
    []
  );

  useWidgets(dashboard?.widgets || [], onFilesProcessed);

  return (
    <MainLayout>
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} /> All Dashboards
      </Link>
      <div className="margin-top-2">
        <h1 className="margin-bottom-1 display-inline-block font-sans-2xl">
          {dashboard?.name}
        </h1>
        <div className="text-base text-italic">{dashboard?.topicAreaName}</div>
      </div>
      <div className="margin-y-2">
        {dashboard?.description ? (
          <ReactMarkdown
            source={dashboard.description}
            className="font-sans-lg usa-prose"
          />
        ) : (
          <p>No description entered</p>
        )}
      </div>
      <hr />
      {allFilesProcessed &&
        dashboard?.widgets.map((widget, index) => {
          return (
            <div className="margin-top-5">
              <WidgetRender key={index} widget={widget} />
            </div>
          );
        })}
    </MainLayout>
  );
}

export default ViewDashboard;
