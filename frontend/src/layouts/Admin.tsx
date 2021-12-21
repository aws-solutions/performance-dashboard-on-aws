import React, { ReactNode, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Auth from "@aws-amplify/auth";
import {
  useSettings,
  useCurrentAuthenticatedUser,
  useFavicon,
  useFileLoaded,
} from "../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import Logo from "../components/Logo";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { Helmet } from "react-helmet";
import defaultFavicon from "../favicon.svg";
import "./Admin.scss";

interface LayoutProps {
  children: ReactNode;
}

function AdminLayout(props: LayoutProps) {
  const { username, isAdmin, isFederatedId, isEditor, hasRole } =
    useCurrentAuthenticatedUser();
  const { settings, loadingSettings } = useSettings();
  const { favicon, loadingFile } = useFavicon(settings.customFaviconS3Key);
  const [toHide, setToHide] = useState<boolean>(true);
  const { t } = useTranslation();

  const signOut = async (event: React.MouseEvent) => {
    try {
      if (isFederatedId) {
        event.preventDefault();
      }
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
      event.preventDefault();
    }
  };

  useFileLoaded(setToHide, loadingFile, loadingSettings, settings, "favicon");

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
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text display-flex flex-align-center">
                <div className="logo">
                  <Logo />
                </div>

                <Link to="/admin" title="Home" aria-label="Home" className="">
                  {settings.navbarTitle}
                </Link>
              </em>
            </div>
            <button className="usa-menu-btn bg-primary-dark">
              {t("AdminMenu.Menu")}
            </button>
          </div>
          <nav
            aria-label={t("AdminMenu.PrimaryNavigation")}
            className="usa-nav"
          >
            <button className="usa-nav__close">
              <FontAwesomeIcon icon={faWindowClose} size="lg" role="img" />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              {isAdmin || isEditor ? (
                <>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" to="/admin/dashboards">
                      {t("AdminMenu.Dashboards")}
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
              {isAdmin ? (
                <>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" to="/admin/users">
                      {t("AdminMenu.ManageUsers")}
                    </Link>
                  </li>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" to="/admin/settings">
                      {t("AdminMenu.Settings")}
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
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
                    <a href="/admin" onClick={signOut} className="usa-link">
                      {t("AdminMenu.Logout")}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </Header>
      <main className="padding-y-3">
        {!hasRole && <Redirect to="/403/access-denied" />}
        <div className="grid-container">{props.children}</div>
      </main>
      <Footer />
    </>
  );
}

export const withAdminLayout = (
  component: React.ComponentType
): React.FunctionComponent<{}> => {
  return function () {
    return <AdminLayout>{React.createElement(component)}</AdminLayout>;
  };
};

export default withAdminLayout;
