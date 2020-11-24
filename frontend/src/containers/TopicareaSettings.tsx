import React from "react";
import TopicareaListing from "./TopicareaListing";
import SettingsLayout from "../layouts/Settings";

function TopicareaSettings() {
  return (
    <SettingsLayout>
      <h1>Topic areas</h1>

      <p>
        Dashboards are organized by topic areas. A dashboard must have a topic
        area and can have only on topic area.
      </p>

      <h3 id="section-heading-h2">Topic area name</h3>

      <p>
        You can customize the name "topic area" and it will be replaced
        throughout the interface. For example, "topic area" can be renamed to
        "department", "ministry", "program", "agency", etc.
      </p>

      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#dfe1e2",
          margin: "2rem 0",
        }}
      />

      <TopicareaListing onDelete={() => {}}></TopicareaListing>
    </SettingsLayout>
  );
}

export default TopicareaSettings;
