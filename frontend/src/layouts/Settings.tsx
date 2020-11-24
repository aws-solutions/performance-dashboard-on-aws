import React, { ReactNode } from "react";
import "./Settings.css";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

function SettingsLayout(props: LayoutProps) {
  const { pathname } = useLocation();
  let currentSetting = "topicarea";
  const validSettings = ["topicarea"];

  const queryString = pathname.split("/");
  if (queryString.length > 2 && validSettings.includes(queryString[2])) {
    currentSetting = queryString[2];
  }

  return (
    <div className="usa-section">
      <div className="grid-container">
        <div className="grid-row grid-gap">
          <div className="desktop:grid-col-3">
            <nav aria-label="Left navigation">
              <ul className="usa-sidenav">
                <li className="usa-sidenav__item">
                  <a href="/admin/settings/topicarea" className="usa-current">
                    Settings
                  </a>
                  <ul className="usa-sidenav__sublist">
                    <li className="usa-sidenav__item">
                      <a
                        className={
                          currentSetting === "topicarea" ? "usa-current" : ""
                        }
                        href="/admin/settings/topicarea"
                      >
                        Topic areas
                      </a>
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
  );
}

export default SettingsLayout;
