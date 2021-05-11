import React, { createRef } from "react";
import { Widget, WidgetType } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import "./WidgetList.css";
import Link from "./Link";
import AlertContainer from "../containers/AlertContainer";
import SecondaryActionBar from "./SecondaryActionBar";
import ContentItem from "./ContentItem";
import { useTranslation } from "react-i18next";

interface Props {
  onClick: Function;
  onDelete?: Function;
  onDuplicate?: Function;
  onMoveUp?: Function;
  onMoveDown?: Function;
  widgets: Array<Widget>;
}

function WidgetList(props: Props) {
  const { t } = useTranslation();
  const caretUpRefs = props.widgets.map(() => createRef<HTMLButtonElement>());
  const caretDownRefs = props.widgets.map(() => createRef<HTMLButtonElement>());

  const onDelete = (widget: Widget) => {
    if (props.onDelete) {
      props.onDelete(widget);
    }
  };

  const onDuplicate = (widget: Widget) => {
    if (props.onDuplicate) {
      props.onDuplicate(widget);
    }
  };

  const onMoveDown = (index: number) => {
    if (props.onMoveDown) {
      setNextFocus(index, "Down");
      props.onMoveDown(index);
    }
  };

  const onMoveUp = (index: number) => {
    if (props.onMoveUp) {
      setNextFocus(index, "Up");
      props.onMoveUp(index);
    }
  };

  const setNextFocus = (index: number, direction: "Up" | "Down") => {
    let ref;
    /**
     * When moving a widget up or down, the focus should follow the
     * widget to its new position in the list. Determining the new
     * position depends on whether the widget is moving up or down
     * and if the widget has reached a boundary (i.e. beginning or
     * end of the list), in which case the focus should swap to the
     * opposite caret (careUp vs caretDown).
     *
     * We may not need this logic when we implement drag-n-drop
     * because most of the existing libraries already handle browser
     * focus when moving DOM objects.
     */
    if (direction === "Up") {
      const next = index - 1;
      ref = next === 0 ? caretDownRefs[0] : caretUpRefs[next];
    } else {
      const next = index + 1;
      const last = props.widgets.length - 1;
      ref = next === last ? caretUpRefs[last] : caretDownRefs[next];
    }

    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div>
      {props.widgets && props.widgets.length ? (
        <div>
          <AlertContainer />
          <SecondaryActionBar stickyPosition={160}>
            <h3 className="margin-bottom-0 margin-top-0">
              {t("DashboardContent")}
            </h3>
            <p className="margin-top-2px margin-bottom-0">
              {t("BuildDashboardGuidance")}
            </p>
            <div className="grid-row radius-lg margin-top-4 text-bold font-sans-sm">
              <div className="grid-col flex-1">
                <div className="margin-left-1">{t("Order")}</div>
              </div>
              <div className="grid-col flex-5">
                <div className="margin-left-2">{t("NameUpperCase")}</div>
              </div>
              <div className="grid-col flex-6">
                <div className="margin-left-6">{t("ContentType")}</div>
              </div>
            </div>
          </SecondaryActionBar>
          {props.widgets.map((widget, index) => {
            return (
              <ContentItem className="grid-row margin-y-1" key={index}>
                <div className="grid-row grid-col flex-1 padding-1">
                  <div className="grid-col flex-6 text-center display-flex flex-align-center flex-justify-center font-sans-md">
                    {index + 1}
                  </div>
                  <div className="grid-col flex-6 grid-row flex-column text-center">
                    <div className="grid-col flex-6">
                      {index > 0 && (
                        <Button
                          variant="unstyled"
                          className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                          ariaLabel={t("MoveContentItemUp", {
                            name: widget.name,
                          })}
                          onClick={() => onMoveUp(index)}
                          ref={caretUpRefs[index]}
                        >
                          <FontAwesomeIcon size="sm" icon={faArrowUp} />
                        </Button>
                      )}
                    </div>
                    <div className="grid-col flex-6">
                      {index < props.widgets.length - 1 && (
                        <Button
                          variant="unstyled"
                          className="text-base-darker hover:text-base-darkest active:text-base-darkest"
                          ariaLabel={t("MoveContentItemDown", {
                            name: widget.name,
                          })}
                          onClick={() => onMoveDown(index)}
                          ref={caretDownRefs[index]}
                        >
                          <FontAwesomeIcon
                            id={`${widget.id}-move-down`}
                            size="sm"
                            icon={faArrowDown}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-base-lighter border-left"></div>
                <div className="grid-col flex-11 grid-row padding-1 margin-y-1">
                  <div
                    className="grid-col flex-6 usa-tooltip text-bold"
                    data-position="bottom"
                    title={widget.name}
                  >
                    <div className="margin-left-1 text-no-wrap overflow-hidden text-overflow-ellipsis">
                      {widget.name}
                    </div>
                  </div>
                  <div className="grid-col flex-3 text-italic">
                    {t(
                      widget.widgetType === WidgetType.Chart
                        ? widget.content.chartType
                        : widget.widgetType
                    )}
                  </div>
                  <div className="grid-col flex-3 text-right">
                    <Link
                      ariaLabel={t("EditContent", { name: widget.name })}
                      to={`/admin/dashboard/${
                        widget.dashboardId
                      }/edit-${widget.widgetType.toLowerCase()}/${widget.id}`}
                    >
                      {t("Edit")}
                    </Link>
                    <Button
                      variant="unstyled"
                      className="margin-left-2 text-base-dark hover:text-base-darker active:text-base-darkest"
                      onClick={() => onDuplicate(widget)}
                      ariaLabel={t("DuplicateContent", { name: widget.name })}
                    >
                      {t("Duplicate")}
                    </Button>
                    <Button
                      variant="unstyled"
                      className="margin-left-2 text-base-dark hover:text-base-darker active:text-base-darkest"
                      onClick={() => onDelete(widget)}
                      ariaLabel={t("DeleteContent", { name: widget.name })}
                    >
                      {t("Delete")}
                    </Button>
                  </div>
                </div>
              </ContentItem>
            );
          })}
          <div className="text-center margin-top-2">
            <button
              className="usa-button usa-button--base margin-top-1"
              onClick={() => {
                if (props.onClick) {
                  props.onClick();
                }
              }}
            >
              {t("PlusAddContentItem")}
            </button>
          </div>
        </div>
      ) : (
        <SecondaryActionBar className="text-center padding-5 margin-y-2">
          <div>
            <p>
              {t("NoContentItems")} <br />
              {t("ChartsTablesMore")}
            </p>
            <div className="text-center margin-top-4">
              <Button
                className="margin-top-1"
                variant="base"
                onClick={() => {
                  if (props.onClick) {
                    props.onClick();
                  }
                }}
              >
                {t("PlusAddContentItem")}
              </Button>
            </div>
          </div>
        </SecondaryActionBar>
      )}
    </div>
  );
}

export default WidgetList;
