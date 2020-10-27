import React, { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import "./Main.css";

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
              <em className="usa-logo__text">
                <a href="/" title="Home" aria-label="Home">
                  Performance Dashboard
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
                <a href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`}>
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

export default MainLayout;
