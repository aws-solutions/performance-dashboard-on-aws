import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function MainLayout(props: LayoutProps) {
  return (
    <>
      <div className="usa-overlay"></div>
      <section className="usa-hero">
        <div className="grid-container">
          <div className="usa-hero__callout">
            <h1 className="usa-hero__heading">
              Performance Dashboard
            </h1>
            <p>Find information about your government digital services</p>
          </div>
        </div>
      </section>
      <main className="minh-mobile">
        <div className="grid-container">{props.children}</div>
      </main>
      <footer className="usa-footer">
        <div className="usa-footer__secondary-section">
          <div className="grid-container">
            Amazon Web Services
          </div>
        </div>
      </footer>
    </>
  );
}

export default MainLayout;
