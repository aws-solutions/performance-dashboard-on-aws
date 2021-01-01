import React from "react";
import { useHistory } from "react-router-dom";
import { useHomepage, useSettings } from "../hooks";
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
  const { settings, loadingSettings } = useSettings(true);

  const onContentEdit = () => {
    history.push("/admin/settings/publishedsite/contentedit");
  };

  const onNavbarEdit = () => {
    history.push("/admin/settings/publishedsite/navbaredit");
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
      <h3 className="margin-top-2-important">Navigation Bar</h3>

      <p>You can customize the header and navigation of the published site.</p>

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <p className="text-bold">Title</p>
        </div>
        <div className="grid-col flex-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onNavbarEdit}
          >
            Edit
          </Button>
        </div>
      </div>

      {loadingSettings ? (
        <Spinner className="margin-top-3 text-center" label="Loading" />
      ) : (
        <div className="grid-row margin-top-0-important margin-bottom-4">
          <div className="grid-col flex-9">
            <div className="published-site font-sans-lg">
              <MarkdownRender source={settings.navbarTitle} />
            </div>
          </div>
          <div className="grid-col flex-3 text-right"></div>
        </div>
      )}

      <hr className="border-gray-5" />

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
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onContentEdit}
          >
            Edit
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner className="margin-top-3 text-center" label="Loading" />
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
