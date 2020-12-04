import React from "react";
import { useHistory } from "react-router-dom";
import { useHomepage } from "../hooks";
import SettingsLayout from "../layouts/Settings";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import AlertContainer from "./AlertContainer";
import Link from "../components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import "./PublishedSiteSettings.css";

function PublishedSiteSettings() {
  const history = useHistory();
  const { homepage, loading } = useHomepage();

  const onEdit = () => {
    history.push("/admin/settings/publishedsite/edit");
  };

  return (
    <SettingsLayout>
      <h1>Published site</h1>

      <p>
        Customize your published site.{" "}
        <Link target="_blank" to={"/"}>
          View published site
          <FontAwesomeIcon
            className="margin-left-05"
            icon={faExternalLinkAlt}
            size="xs"
          />
        </Link>
      </p>

      <AlertContainer />
      <h3 className="margin-top-2-important">Homepage content</h3>

      <p>
        This components appear on the homepage of your published site and
        explain what your published site is about.
      </p>

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <p className="text-bold">Headline</p>
        </div>
        <div className="grid-col flex-3 text-right">
          <Button className="margin-top-2" variant="outline" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
          }}
          label="Loading"
        />
      ) : (
        <div className="grid-row margin-top-0-important">
          <div className="grid-col flex-9">
            <div className="published-site font-sans-lg">
              <MarkdownRender source={homepage.title} />
            </div>
            <div className="grid-col flex-9">
              <p className="text-bold">Description</p>
            </div>
            <div className="font-sans-lg">
              <MarkdownRender source={homepage.description} />
            </div>
          </div>
          <div className="grid-col flex-3 text-right"></div>
        </div>
      )}
    </SettingsLayout>
  );
}

export default PublishedSiteSettings;
