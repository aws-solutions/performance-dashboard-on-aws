import React, { useCallback, useState } from "react";
import { parse } from "papaparse";
import { useHistory, useParams } from "react-router-dom";
import { useDashboard, useWidgets } from "../hooks";
import { Widget, LocationState } from "../models";
import AdminLayout from "../layouts/Admin";
import ReactMarkdown from "react-markdown";
import LineChartPreview from "../components/LineChartPreview";
import ColumnChartPreview from "../components/ColumnChartPreview";
import BarChartPreview from "../components/BarChartPreview";
import PartWholeChartPreview from "../components/PartWholeChartPreview";
import TablePreview from "../components/TablePreview";
import Button from "../components/Button";
import BadgerService from "../services/BadgerService";
import Alert from "../components/Alert";
import "./DashboardPreview.css";

interface PathParams {
  dashboardId: string;
}

function DashboardPreview() {
  const history = useHistory<LocationState>();
  const { dashboardId } = useParams<PathParams>();
  const { dashboard } = useDashboard(dashboardId);
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

  const onPublish = async () => {
    if (
      window.confirm(
        "Are you sure you want to publish this dashboard? After publishing, the dashboard will be viewable on the external dashboard website."
      )
    ) {
      if (dashboard) {
        await BadgerService.publishDashboard(dashboard.id, dashboard.updatedAt);
        history.push("/admin/dashboards", {
          alert: {
            type: "success",
            message: `${dashboard.name} dashboard was successfully published`,
          },
        });
      }
    }
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboard?.id}`);
  };

  return (
    <AdminLayout>
      <div className="position-sticky top-0 bg-white z-index-on-top">
        <Alert
          type="info"
          message="Below is a preview of what the published dashboard will look like.
              If everything looks right, you can publish the dashboard to be
              viewable on the external site."
        />
        <div className="grid-row margin-top-2">
          <div className="grid-col text-left">
            <span className="usa-tag text-middle">Preview</span>
          </div>
          <div className="grid-col text-right">
            <Button variant="base" onClick={onPublish}>
              Publish
            </Button>
            <Button variant="outline" type="button" onClick={onCancel}>
              Close Preview
            </Button>
          </div>
        </div>
        <div className="margin-top-2 gradient height-4" />
      </div>
      <div>
        <h1 className="margin-bottom-0 display-inline-block">
          {dashboard?.name}
        </h1>
      </div>
      <div className="text-base text-italic">{dashboard?.topicAreaName}</div>
      <div>
        {dashboard?.description ? (
          <ReactMarkdown source={dashboard.description} />
        ) : (
          <p>No description entered</p>
        )}
      </div>
      <hr />

      {allFilesProcessed
        ? dashboard?.widgets.map((widget, index) => {
            if (widget.widgetType === "Text") {
              return (
                <div className="margin-top-5" key={index}>
                  <h2>{widget.name}</h2>
                  <ReactMarkdown source={widget.content.text} />
                </div>
              );
            }
            const keys =
              widget &&
              widget.content &&
              widget.content.data &&
              widget.content.data.length
                ? (Object.keys(widget.content.data[0]) as Array<string>)
                : [];
            if (widget.widgetType === "Chart") {
              if (widget.content.chartType === "LineChart") {
                return (
                  <div className="margin-top-5" key={index}>
                    <LineChartPreview
                      title={widget.content.title}
                      lines={keys}
                      data={widget.content.data}
                    />
                  </div>
                );
              }
              if (widget.content.chartType === "ColumnChart") {
                return (
                  <div className="margin-top-5" key={index}>
                    <ColumnChartPreview
                      title={widget.content.title}
                      columns={keys}
                      data={widget.content.data}
                    />
                  </div>
                );
              }
              if (widget.content.chartType === "BarChart") {
                return (
                  <div className="margin-top-5" key={index}>
                    <BarChartPreview
                      title={widget.content.title}
                      bars={keys}
                      data={widget.content.data}
                    />
                  </div>
                );
              }
              if (widget.content.chartType === "PartWholeChart") {
                return (
                  <div className="margin-top-5" key={index}>
                    <PartWholeChartPreview
                      title={widget.content.title}
                      parts={keys}
                      data={widget.content.data}
                    />
                  </div>
                );
              }
            }
            if (widget.widgetType === "Table") {
              return (
                <div className="margin-top-5" key={index}>
                  <TablePreview
                    title={widget.content.title}
                    headers={keys}
                    data={widget.content.data}
                  />
                </div>
              );
            }
            return "";
          })
        : ""}
    </AdminLayout>
  );
}

export default DashboardPreview;
