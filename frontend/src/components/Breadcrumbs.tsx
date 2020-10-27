import React from "react";
import { Link } from "react-router-dom";

interface Props {
  crumbs?: Array<{
    label: string;
    url?: string;
  }>;
}

function Breadcrumbs(props: Props) {
  return (
    <nav className="usa-breadcrumb padding-top-0" aria-label="Breadcrumbs">
      <ol className="usa-breadcrumb__list">
        {props.crumbs?.map((crumb) => {
          return crumb.url ? (
            <li className="usa-breadcrumb__list-item" key={crumb.label}>
              <Link to={crumb.url} className="usa-breadcrumb__link">
                <span>{crumb.label}</span>
              </Link>
            </li>
          ) : (
            <li
              className="usa-breadcrumb__list-item usa-current"
              aria-current="page"
              key={crumb.label}
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
