import React from "react";
import { useHistory } from "react-router-dom";
import { useSettings } from "../hooks";
import SettingsLayout from "../layouts/Settings";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import AlertContainer from "./AlertContainer";
import "./PublishingGuidanceSettings.css";

function PublishingGuidanceSettings() {
  const history = useHistory();
  const { settings } = useSettings();

  const onEdit = () => {
    history.push("/admin/settings/publishingguidance/edit");
  };

  return (
    <SettingsLayout>
      <h1>Publishing guidance</h1>

      <p>
        Publishing guidance is text that users must acknowledge before they
        publish a dashboard. For example, use this text to remind them to check
        for errors or mistakes, sensitive or confidential data, or guidance
        specific to your organization.
      </p>

      <AlertContainer />
      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <p className="text-bold">Acknowledgement statement</p>
        </div>
        <div className="grid-col flex-3 text-right">
          <Button className="margin-top-2" variant="outline" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <div className="publishing-guidance font-sans-lg">
            <MarkdownRender source={settings.publishingGuidance} />
          </div>
        </div>
        <div className="grid-col flex-3 text-right"></div>
      </div>
    </SettingsLayout>
  );
}

export default PublishingGuidanceSettings;
