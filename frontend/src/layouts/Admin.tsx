import React, { ReactNode } from "react";
import { Auth } from "aws-amplify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

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
  return (
    <>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text">
                <a href="/admin" title="Home" aria-label="Home">
                  Badger
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
                  className="usa-accordion__button usa-nav__link  usa-current"
                  aria-expanded="false"
                  aria-controls="basic-nav-section-one"
                >
                  <span>Admin</span>
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

export default AdminLayout;
