import React from "react";
import { Link } from "react-router-dom";

/**
 * This is a dummy placeholder implementation of breadcrumbs.
 * We need to implement this for real at some point.
 */
function Breadcrumbs() {
  return (
    <nav className="usa-breadcrumb padding-top-0" aria-label="Breadcrumbs">
      <ol className="usa-breadcrumb__list">
        <li className="usa-breadcrumb__list-item">
          <Link to="/admin" className="usa-breadcrumb__link">
            <span>Home</span>
          </Link>
        </li>
        <li className="usa-breadcrumb__list-item">
          <Link to="/admin/dashboards" className="usa-breadcrumb__link">
            <span>Dashboards</span>
          </Link>
        </li>
        <li
          className="usa-breadcrumb__list-item usa-current"
          aria-current="page"
        >
          <span>Edit</span>
        </li>
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
