import React, { ReactNode } from "react";
import "./Settings.css";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { Link } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

function SettingsLayout(props: LayoutProps) {
  const { pathname } = useLocation();
  let currentSetting = "topicarea";
  const validSettings: any = { topicarea: "Topic areas" };

  const queryString = pathname.split("/");
  if (
    queryString.length > 2 &&
    Object.keys(validSettings).includes(queryString[2])
  ) {
    currentSetting = queryString[2];
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Settings",
            url: "/admin/settings/topicarea",
          },
          {
            label: `${validSettings[currentSetting]}`,
          },
        ]}
      />

      <div className="usa-section padding-top-3">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="desktop:grid-col-3">
              <nav aria-label="Left navigation">
                <ul className="usa-sidenav">
                  <li className="usa-sidenav__item">
                    <Link
                      to="/admin/settings/topicarea"
                      className="usa-current"
                    >
                      Settings
                    </Link>
                    <ul className="usa-sidenav__sublist">
                      <li className="usa-sidenav__item">
                        <Link
                          className={
                            currentSetting === "topicarea" ? "usa-current" : ""
                          }
                          to="/admin/settings/topicarea"
                        >
                          Topic areas
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
    </>
  );
}

export default SettingsLayout;
