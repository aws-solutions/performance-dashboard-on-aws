import React, { ReactNode } from "react";
import { Auth } from "aws-amplify";
import { useAdmin } from "../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import EnvConfig from "../services/EnvConfig";
import logo from "../logo.svg";

interface LayoutProps {
  children: ReactNode;
}

async function signOut(event: React.MouseEvent) {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log("error signing out: ", error);
    event.preventDefault();
  }
}

function AdminLayout(props: LayoutProps) {
  const { username } = useAdmin();

  return (
    <>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar navbar-long">
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text display-flex flex-align-center">
                <img src={logo} alt="logo" className="logo" />
                <a href="/admin" title="Home" aria-label="Home">
                  {EnvConfig.brandName}
                </a>
              </em>
            </div>
            <button className="usa-menu-btn">Menu</button>
          </div>
          <nav aria-label="Primary navigation" className="usa-nav">
            <button className="usa-nav__close">
              <FontAwesomeIcon icon={faWindowClose} size="lg" role="img" />
            </button>
            <ul className="usa-nav__primary usa-accordion">
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
                  className="usa-nav__submenu"
                  hidden
                >
                  <li className="usa-nav__submenu-item">
                    <a href="/admin" onClick={signOut} className="usa-link">
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="padding-y-3">
        <div className="grid-container">{props.children}</div>
      </main>
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
