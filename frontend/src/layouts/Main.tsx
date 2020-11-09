import React, { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import logo from "../logo.svg";

interface LayoutProps {
  children?: ReactNode;
}

function MainLayout(props: LayoutProps) {
  return (
    <>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar navbar-long">
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text display-flex flex-align-center">
                <img src={logo} alt="logo" className="logo" />
                <a href="/" title="Home" aria-label="Home">
                  {process.env.REACT_APP_BRAND_NAME}
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
                <a
                  href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}?subject=Performance Dashboard Assistance`}
                  className="usa-nav__link"
                >
                  Contact
                </a>
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

export const withMainLayout = (
  component: React.ComponentType
): React.FunctionComponent<{}> => {
  return function () {
    return <MainLayout>{React.createElement(component)}</MainLayout>;
  };
};

export default withMainLayout;
