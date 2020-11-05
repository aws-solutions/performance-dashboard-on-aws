import React from "react";
import Link from "./Link";

interface Props {
  crumbs: Array<{
    label?: string;
    url?: string;
  }>;
}

function Breadcrumbs(props: Props) {
  return (
    <nav className="usa-breadcrumb padding-top-0" aria-label="Breadcrumbs">
      <ol className="usa-breadcrumb__list">
        {props.crumbs?.map((crumb, index) => {
          return crumb.url ? (
            <li
              className="usa-breadcrumb__list-item"
              key={crumb.label || index}
            >
              <Link to={crumb.url}>
                <span>{crumb.label}</span>
              </Link>
            </li>
          ) : (
            <li
              className="usa-breadcrumb__list-item usa-current cursor-default"
              aria-current="page"
              key={crumb.label || index}
            >
              <span>{crumb.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
