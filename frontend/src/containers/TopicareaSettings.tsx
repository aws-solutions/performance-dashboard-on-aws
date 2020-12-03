import React from "react";
import TopicareaListing from "./TopicareaListing";
import SettingsLayout from "../layouts/Settings";
import EnvConfig from "../services/EnvConfig";

function TopicareaSettings() {
  return (
    <SettingsLayout>
      <h1>{EnvConfig.topicAreasLabel}</h1>

      <p>
        {`Dashboards are organized by ${EnvConfig.topicAreasLabel.toLocaleLowerCase()}. ` +
          `A dashboard must have a ${EnvConfig.topicAreaLabel.toLowerCase()} and can ` +
          `have only one ${EnvConfig.topicAreaLabel.toLowerCase()}.`}
      </p>

      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#dfe1e2",
          margin: "2rem 0",
        }}
      />

      <TopicareaListing />
    </SettingsLayout>
  );
}

export default TopicareaSettings;
