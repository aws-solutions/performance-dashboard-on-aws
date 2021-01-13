import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings } from "../hooks";
import Button from "../components/Button";
import TopicareaListing from "./TopicareaListing";
import SettingsLayout from "../layouts/Settings";
import EnvConfig from "../services/EnvConfig";
import AlertContainer from "./AlertContainer";
import MarkdownRender from "../components/MarkdownRender";
import UtilsService from "../services/UtilsService";

function TopicareaSettings() {
  const { settings, loadingSettings } = useSettings(true);
  const history = useHistory();

  const onTopicAreaLabelEdit = () => {
    history.push("/admin/settings/topicarea/editlabel");
  };

  return (
    <SettingsLayout>
      {loadingSettings ? (
        ""
      ) : (
        <>
          <h1>
            {UtilsService.determineTopicAreaString(
              EnvConfig.topicAreasLabel,
              settings.topicAreaLabels?.plural
            )}
          </h1>

          <p>
            Dashboards are organized by topic areas. A dashboard must have a
            topic area and can have only one topic area.
          </p>
          <AlertContainer />
          <h3 className="margin-top-2-important">Topic area name</h3>

          <p>
            You can customize the name "topic area" and it will be replaced
            throughout the interface. For example, "topic area" can be renamed
            to "department", "ministry", "program", "agency", etc.
          </p>

          <div className="grid-row margin-top-0-important">
            <div className="grid-col flex-9">
              <p className="text-bold">Single topic area name</p>
            </div>
            <div className="grid-col flex-3 text-right">
              <Button
                className="margin-top-2"
                variant="outline"
                onClick={onTopicAreaLabelEdit}
              >
                Edit
              </Button>
            </div>
          </div>
          <div className="grid-row margin-top-0-important margin-bottom-4">
            <div className="grid-col flex-9">
              <div className="published-site font-sans-lg">
                <MarkdownRender source={settings.topicAreaLabels?.singular} />
              </div>
            </div>
            <div className="grid-col flex-3 text-right"></div>
          </div>
          <div className="grid-col flex-9">
            <p className="text-bold">Multiple topic areas name</p>
          </div>

          <div className="grid-row margin-top-0-important margin-bottom-4">
            <div className="grid-col flex-9">
              <div className="published-site font-sans-lg">
                <MarkdownRender source={settings.topicAreaLabels?.plural} />
              </div>
            </div>
            <div className="grid-col flex-3 text-right"></div>
          </div>
          <hr
            style={{
              border: "none",
              height: "1px",
              backgroundColor: "#dfe1e2",
              margin: "2rem 0",
            }}
          />
        </>
      )}

      <TopicareaListing />
    </SettingsLayout>
  );
}

export default TopicareaSettings;
