import React, { useEffect } from "react";
import { NavHashLink } from "react-router-hash-link";

interface WidgetNameId {
  name: string;
  id: string;
  isInsideSection: boolean;
}

interface Props {
  stickyPosition: number;
  offset: number;
  widgetNameIds: Array<WidgetNameId>;
  activeWidgetId: string;
  setActivewidgetId: React.Dispatch<React.SetStateAction<string>>;
  isTop: boolean;
  area: number;
  marginRight: number;
  displayTableOfContents: boolean;
  onClick?: Function;
}

function Navigation({
  stickyPosition,
  offset,
  widgetNameIds,
  activeWidgetId,
  setActivewidgetId,
  isTop,
  area,
  displayTableOfContents,
  onClick,
  marginRight,
}: Props) {
  // forcefully highlight the last tab in table of contents when user reaches
  // the bottom of the page
  const handleScroll = () => {
    const isBottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;
    if (isBottom && widgetNameIds.length) {
      setActivewidgetId(widgetNameIds[widgetNameIds.length - 1].id);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -offset;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
  };

  const onClickHandler = (active: string) => {
    if (onClick) {
      onClick(active);
    }
  };

  if (!isTop) {
    return (
      <div
        className={`tablet:grid-col-${area}`}
        style={{
          position: "sticky",
          top: stickyPosition,
          float: "right",
          marginRight: `-${marginRight}%`,
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
              marginLeft: 0,
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
                  }}
                  onClick={() => onClickHandler(widget.id)}
                >
                  <NavHashLink
                    to={"#" + widget.id}
                    scroll={(el) => scrollWithOffset(el)}
                    style={{
                      paddingLeft: widget.isInsideSection ? "32px" : "10px",
                    }}
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
            marginLeft: 0,
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
                }}
                onClick={() => onClickHandler(widget.id)}
              >
                <NavHashLink
                  to={"#" + widget.id}
                  scroll={(el) => scrollWithOffset(el)}
                  style={{
                    paddingLeft: widget.isInsideSection ? "36px" : "16px",
                  }}
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
