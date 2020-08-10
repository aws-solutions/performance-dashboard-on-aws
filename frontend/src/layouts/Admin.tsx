import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode,
}

function AdminLayout(props: LayoutProps) {
  return (
    <div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-logo" id="basic-logo">
            <em className="usa-logo__text">
              <a href="/admin" title="Home" aria-label="Home">
                Badger
              </a>
            </em>
          </div>
        </div>
      </header>
      <main>
        <section className="padding-top-3">
          <div className="grid-container">
            {props.children}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;