import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode,
}

function AdminLayout(props: LayoutProps) {
  return (
    <div className="ds-base">
      <header className="ds-base--inverse ds-u-padding--2 ds-u-display--flex">
        <h1 className="ds-h3">Badger</h1>
      </header>
      <main>
        <section className="ds-l-container">
          {props.children}
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;