import React, { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import Logo from "../components/Logo";
import { Auth } from "@aws-amplify/auth";
import {
  usePublicSettings,
  useFavicon,
  useFileLoaded,
  useCurrentAuthenticatedUser,
} from "../hooks";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { Helmet } from "react-helmet";
import defaultFavicon from "../favicon.svg";
import ReactGA from "react-ga";

interface LayoutProps {
  children?: ReactNode;
}

function PublicLayout(props: LayoutProps) {
  const { settings, loadingSettings } = usePublicSettings();
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);
  const { username, isFederatedId } = useCurrentAuthenticatedUser();
  const [toHide, setToHide] = useState<boolean>(true);
  const { t } = useTranslation();

  const signOut = async (event: React.MouseEvent) => {
    event.preventDefault();
    setTimeout(async () => {
      try {
        await Auth.signOut();
        if (!isFederatedId) {
          window.location.href = "/admin";
        }
      } catch (error) {
        console.log("error signing out: ", error);
        event.preventDefault();
      }
    });
  };

  useFileLoaded(setToHide, loadingFile, loadingSettings, settings, "favicon");

  let collectAnalytics = false;
  if (settings.analyticsTrackingId && settings.analyticsTrackingId !== "NA") {
    collectAnalytics = true;
    ReactGA.initialize(settings.analyticsTrackingId, {
      debug: false,
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
  }

  useEffect(() => {
    if (collectAnalytics) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      {loadingFile || loadingSettings || toHide ? (
        <Helmet>
          <link />
        </Helmet>
      ) : (
        <Helmet>
          <link
            id="favicon"
            rel="icon"
            type="image/png"
            href={favicon ? URL.createObjectURL(favicon) : defaultFavicon}
          />
        </Helmet>
      )}

      <div className="usa-overlay"></div>
      <Header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar navbar-long">
            <div>
              <a className="usa-skipnav" href="#main">
                {t("SkipToMainContent")}
              </a>
            </div>
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text display-flex flex-align-center">
                <div className="logo">
                  <Logo />
                </div>

                <Link to="/" title={t("Home")} aria-label={t("Home")}>
                  {settings.navbarTitle}
                </Link>
              </em>
            </div>
            <button className="usa-menu-btn bg-primary-dark">
              {t("Public.Menu")}
            </button>
          </div>
          <nav aria-label="Primary navigation" className="usa-nav">
            <button className="usa-nav__close" aria-label={t("CloseMenu")}>
              <FontAwesomeIcon
                icon={faWindowClose}
                size="lg"
                role="img"
                aria-hidden="true"
                aria-label={t("CloseMenu")}
              />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <Link
                  to="/public/contact"
                  title={t("Public.Contact")}
                  aria-label={t("Public.Contact")}
                >
                  {t("Public.Contact")}
                </Link>
              </li>
              {window.EnvironmentConfig?.authenticationRequired && (
                <li className="usa-nav__primary-item">
                  <button
                    className="usa-accordion__button usa-nav__link"
                    aria-expanded="false"
                    aria-controls="basic-nav-section-one"
                  >
                    <span>{username}</span>
                  </button>
                  <ul
                    id="basic-nav-section-one"
                    className="usa-nav__submenu z-index-logout"
                    hidden
                  >
                    <li className="usa-nav__submenu-item">
                      <a href="/" onClick={signOut}>
                        {t("Public.Logout")}
                      </a>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </Header>
      <main className="padding-y-3">
        <div id="main" tabIndex={-1}></div>
        <div className="grid-container">{props.children}</div>
      </main>
    </>
  );
}

export const withPublicLayout = (
  component: React.ComponentType
): React.FunctionComponent<{}> => {
  return function () {
    return <PublicLayout>{React.createElement(component)}</PublicLayout>;
  };
};

export default withPublicLayout;
