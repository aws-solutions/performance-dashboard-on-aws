import React, { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

function MainLayout(props: LayoutProps) {
  return (
    <>
      <div className="usa-overlay"></div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text">
                <a href="/" title="Home" aria-label="Home">
                  Performance Dashboard
                </a>
              </em>
            </div>
          </div>
        </div>
      </header>
      <main className="padding-y-3">
        <div className="grid-container">{props.children}</div>
      </main>
    </>
  );
}

export default MainLayout;
