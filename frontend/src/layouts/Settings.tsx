import React, { ReactNode, useState, useRef, useEffect } from "react";
import "./Settings.css";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { Link } from "react-router-dom";
import { useSettings, useFavicon } from "../hooks";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import defaultFavicon from "../favicon.svg";

interface LayoutProps {
  children?: ReactNode;
}

function SettingsLayout(props: LayoutProps) {
  const { pathname } = useLocation();
  const { settings, loadingSettings } = useSettings(true);
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);
  const [toHide, setToHide] = useState<boolean>(true);
  const { t } = useTranslation();
  let currentSetting = "topicarea";

  const validSettings: any = {
    topicarea: settings.topicAreaLabels.plural,
    publishingguidance: t("PublishingGuidance"),
    publishedsite: t("SettingsPublishedSite"),
    dateformat: t("SettingsDateTimeFormat"),
    brandingandstyling: t("BrandingAndStyling"),
    adminsite: t("AdminSite"),
  };

  const queryString = pathname.split("/");
  if (
    queryString.length > 3 &&
    Object.keys(validSettings).includes(queryString[3])
  ) {
    currentSetting = queryString[3];
  }

  // firstUpdate stops useEffect from executing after the first render
  // secondUpdate stops useEffect from executing when file starts loading
  const firstUpdate = useRef(true);
  const secondUpdate = useRef(true);
  useEffect(() => {
    if (secondUpdate.current) {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      secondUpdate.current = false;
      return;
    }
    setToHide(false);
  }, [loadingFile]);

  return (
    <>
      {loadingFile || loadingSettings || toHide ? (
        <Helmet>
          <title></title>
          <link />
        </Helmet>
      ) : (
        <Helmet>
          <title>
            {settings ? settings.navbarTitle : "Performance Dashboard on AWS"}
          </title>
          <link
            id="favicon"
            rel="icon"
            type="image/png"
            href={favicon ? URL.createObjectURL(favicon) : defaultFavicon}
          />
        </Helmet>
      )}

      <Breadcrumbs
        crumbs={[
          {
            label: t("Settings"),
            url: "/admin/settings/topicarea",
          },
          {
            label: `${validSettings[currentSetting]}`,
          },
        ]}
      />

      {loadingSettings ? (
        ""
      ) : (
        <div className="usa-section padding-top-3">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="desktop:grid-col-3">
                <nav aria-label="Left navigation">
                  <ul className="usa-sidenav">
                    <li className="usa-sidenav__item">
                      <Link to="/admin/settings" className="usa-current">
                        {t("Settings")}
                      </Link>
                      <ul className="usa-sidenav__sublist">
                        <li className="usa-sidenav__item">
                          <Link
                            className={
                              currentSetting === "topicarea"
                                ? "usa-current"
                                : ""
                            }
                            to="/admin/settings/topicarea"
                          >
                            {`${validSettings["topicarea"]}`}
                          </Link>
                        </li>
                      </ul>
                      <ul className="usa-sidenav__sublist">
                        <li className="usa-sidenav__item">
                          <Link
                            className={
                              currentSetting === "publishingguidance"
                                ? "usa-current"
                                : ""
                            }
                            to="/admin/settings/publishingguidance"
                          >
                            {`${validSettings["publishingguidance"]}`}
                          </Link>
                        </li>
                      </ul>
                      <ul className="usa-sidenav__sublist">
                        <li className="usa-sidenav__item">
                          <Link
                            className={
                              currentSetting === "brandingandstyling"
                                ? "usa-current"
                                : ""
                            }
                            to="/admin/settings/brandingandstyling"
                          >
                            {`${validSettings["brandingandstyling"]}`}
                          </Link>
                        </li>
                      </ul>
                      <ul className="usa-sidenav__sublist">
                        <li className="usa-sidenav__item">
                          <Link
                            className={
                              currentSetting === "publishedsite"
                                ? "usa-current"
                                : ""
                            }
                            to="/admin/settings/publishedsite"
                          >
                            {`${validSettings["publishedsite"]}`}
                          </Link>
                        </li>
                      </ul>
                      <ul className="usa-sidenav__sublist">
                        <li className="usa-sidenav__item">
                          <Link
                            className={
                              currentSetting === "dateformat"
                                ? "usa-current"
                                : ""
                            }
                            to="/admin/settings/dateformat"
                          >
                            {`${validSettings["dateformat"]}`}
                          </Link>
                        </li>
                      </ul>
                      <ul className="usa-sidenav__sublist">
                        <li className="usa-sidenav__item">
                          <Link
                            className={
                              currentSetting === "adminsite"
                                ? "usa-current"
                                : ""
                            }
                            to="/admin/settings/adminsite"
                          >
                            {`${validSettings["adminsite"]}`}
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>

              <main className="desktop:grid-col-9 usa-prose" id="main-content">
                {props.children}
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsLayout;
