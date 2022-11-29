/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useHistory } from "react-router-dom";
import { useHomepage, useSettings } from "../hooks";
import SettingsLayout from "../layouts/Settings";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import MarkdownRender from "../components/MarkdownRender";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";
import "./PublishedSiteSettings.css";

function PublishedSiteSettings() {
  const history = useHistory();
  const { homepage, loading } = useHomepage();
  const { settings, loadingSettings } = useSettings();
  const { t } = useTranslation();

  const onContentEdit = () => {
    history.push("/admin/settings/publishedsite/contentedit");
  };

  const onNavbarEdit = () => {
    history.push("/admin/settings/publishedsite/navbaredit");
  };

  const onAnalyticsEdit = () => {
    history.push("/admin/settings/publishedsite/analyticsedit");
  };

  return (
    <SettingsLayout>
      <h1>{t("PublishedSiteSettings.PublishedSite")}</h1>

      <p>
        {t("PublishedSiteSettings.HeaderDescription")}{" "}
        <Link
          target="_blank"
          to="/"
          external
          ariaLabel={`${t("PublishedSiteSettings.ViewPublishedSite")} ${t(
            "ARIA.OpenInNewTab"
          )}`}
        >
          {t("PublishedSiteSettings.ViewPublishedSite")}
        </Link>
      </p>

      <h2 className="margin-top-2-important">
        {t("PublishedSiteSettings.NavigationBar")}
      </h2>

      <p>{t("PublishedSiteSettings.NavagationBarDescription")}</p>

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <h3>{t("PublishedSiteSettings.Title")}</h3>
        </div>
        <div className="grid-col flex-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onNavbarEdit}
          >
            {t("Edit")}
          </Button>
        </div>
      </div>

      {loadingSettings ? (
        <Spinner
          className="margin-top-3 text-center"
          label={t("LoadingSpinnerLabel")}
        />
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

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <h3>{t("PublishedSiteSettings.ContactEmailAddressLabel")}</h3>
        </div>
      </div>

      {loadingSettings ? (
        <Spinner
          className="margin-top-3 text-center"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div className="grid-row margin-top-0-important margin-bottom-4">
          <div className="grid-col flex-9">
            <div className="published-site font-sans-lg">
              <MarkdownRender
                source={
                  settings.contactEmailAddress
                    ? settings.contactEmailAddress
                    : "-"
                }
              />
            </div>
          </div>
          <div className="grid-col flex-3 text-right"></div>
        </div>
      )}

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <h3>{t("PublishedSiteSettings.ContactUsLabel")}</h3>
        </div>
      </div>

      {loadingSettings ? (
        <Spinner
          className="margin-top-3 text-center"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div className="grid-row margin-top-0-important margin-bottom-4">
          <div className="grid-col flex-9">
            <div className="published-site font-sans-lg">
              <MarkdownRender
                source={
                  settings.contactUsContent ? settings.contactUsContent : "-"
                }
              />
            </div>
          </div>
          <div className="grid-col flex-3 text-right"></div>
        </div>
      )}

      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#dfe1e2",
          margin: "2rem 0",
        }}
      />

      <h2 className="margin-top-2-important">
        {t("PublishedSiteSettings.HomepageContentHeader")}
      </h2>

      <p>{t("PublishedSiteSettings.HomepageContentDescription")}</p>

      <div className="grid-row margin-top-0-important">
        <div className="grid-col flex-9">
          <h3>{t("PublishedSiteSettings.Headline")}</h3>
        </div>
        <div className="grid-col flex-3 text-right">
          <Button
            className="margin-top-2"
            variant="outline"
            onClick={onContentEdit}
          >
            {t("Edit")}
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner
          className="margin-top-3 text-center"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div className="grid-row margin-top-0-important">
          <div className="grid-col flex-9">
            <div
              className="published-site font-sans-lg"
              data-testid="published-site-headline"
            >
              <MarkdownRender source={homepage.title} />
            </div>
            <div className="grid-col flex-9">
              <h3>{t("Description")}</h3>
            </div>
            <div className="font-sans-lg">
              <MarkdownRender source={homepage.description} />
            </div>
          </div>
          <div className="grid-col flex-3 text-right"></div>
        </div>
      )}

      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#dfe1e2",
          margin: "2rem 0",
        }}
      />

      <h2 className="margin-top-2-important">
        {t("PublishedSiteSettings.Analytics")}
      </h2>

      {loading ? (
        <Spinner
          className="margin-top-3 text-center"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div className="grid-row margin-top-3-important">
          <div className="grid-col flex-9 text-left">
            {t("PublishedSiteSettings.AnalyticsDescription")}
          </div>
          <div className="grid-col flex-3 text-right">
            <Button
              className="margin-top-0"
              variant="outline"
              onClick={onAnalyticsEdit}
            >
              {t("Edit")}
            </Button>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}

export default PublishedSiteSettings;
