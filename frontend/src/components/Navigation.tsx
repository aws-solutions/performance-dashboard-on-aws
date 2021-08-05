import React from "react";
import { NavHashLink } from "react-router-hash-link";

interface WidgetNameId {
  name: string;
  id: string;
}

interface Props {
  stickyPosition: number;
  offset: number;
  widgetNameIds: Array<WidgetNameId>;
  activeWidgetId: string;
  isTop: boolean;
  displayTableOfContents: boolean;
}

function Navigation({
  stickyPosition,
  offset,
  widgetNameIds,
  activeWidgetId,
  isTop,
  displayTableOfContents,
}: Props) {
  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -offset;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
  };

  if (!isTop) {
    return (
      <div
        className="tablet:grid-col-2"
        style={{
          position: "sticky",
          top: stickyPosition,
          float: "right",
          marginRight: "-27%",
          borderLeft: "1px solid rgba(200, 200, 200, 1)",
        }}
        hidden={!displayTableOfContents}
      >
        <nav aria-label="Secondary navigation">
          <ul
            className="usa-sidenav"
            style={{
              fontSize: "0.9rem",
              borderStyle: "none",
            }}
          >
            {widgetNameIds.map((widget) => {
              return (
                <li
                  className={`usa-sidenav__item ${
                    widget.id === activeWidgetId ? "usa-current" : ""
                  }`}
                  key={widget.id + "link"}
                  style={{
                    borderStyle: "none",
                    marginLeft: "3px",
                  }}
                >
                  <NavHashLink
                    to={"#" + widget.id}
                    scroll={(el) => scrollWithOffset(el)}
                    style={{ paddingLeft: "7px" }}
                  >
                    {widget.name}
                  </NavHashLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <nav aria-label="Secondary navigation" hidden={!displayTableOfContents}>
        <ul
          className="usa-sidenav"
          style={{
            fontSize: "0.9rem",
            borderStyle: "none",
          }}
        >
          {widgetNameIds.map((widget) => {
            return (
              <li
                className="usa-sidenav__item"
                key={widget.id + "link"}
                style={{
                  borderStyle: "none",
                }}
              >
                <NavHashLink
                  to={"#" + widget.id}
                  scroll={(el) => scrollWithOffset(el)}
                  style={{ marginLeft: "0px", paddingLeft: "0px" }}
                >
                  {widget.name}
                </NavHashLink>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Navigation;