import React from "react";
import MarkdownRender from "./MarkdownRender";
import { Widget } from "../models";
import WidgetRender from "./WidgetRender";
import Tabs from "./Tabs";
import TabsVertical from "./TabsVertical";
import { useWindowSize, useColors } from "../hooks";
import { Waypoint } from "react-waypoint";
import { useTranslation } from "react-i18next";

interface Props {
  widget: Widget;
  showMobilePreview?: boolean;
  widgets?: Array<Widget>;
  setActiveWidgetId?: Function;
  topOffset?: string;
  bottomOffset?: string;
  defaultActive?: string;
}

function SectionWidget(props: Props) {
  const { t } = useTranslation();
  const { content, showTitle } = props.widget;
  const windowSize = useWindowSize();
  const primaryColor = useColors(1)[0];

  let activeTabId = "0";
  if (props.widgets && props.defaultActive) {
    const widget = props.widgets?.find(
      (w: Widget) => w.id === props.defaultActive
    );
    if (widget && widget.section) {
      const parent = props.widgets?.find(
        (w: Widget) => w.id === widget.section
      );
      if (parent && parent.id === props.widget.id) {
        const index = parent.content.widgetIds.findIndex(
          (w: string) => w === props.defaultActive
        );
        if (index >= 0) {
          activeTabId = index.toString();
        }
      }
    }
  }

  return (
    <div>
      {!content.showWithTabs ? (
        <Waypoint
          onEnter={() => {
            if (props.setActiveWidgetId) {
              props.setActiveWidgetId(props.widget.id);
            }
          }}
          topOffset={props.topOffset}
          bottomOffset={props.bottomOffset}
          fireOnRapidScroll={false}
        >
          <div>
            {showTitle && <h2>{content.title}</h2>}
            {content.summary ? (
              <div className="padding-left-05">
                <MarkdownRender
                  className="usa-prose textOrSummary"
                  source={content.summary}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </Waypoint>
      ) : (
        <>
          {showTitle && <h2>{content.title}</h2>}
          {content.summary ? (
            <div className="padding-left-05">
              <MarkdownRender
                className="usa-prose textOrSummary"
                source={content.summary}
              />
            </div>
          ) : (
            ""
          )}
        </>
      )}
      {!content.showWithTabs &&
        content.widgetIds &&
        content.widgetIds.map((id: string, index: number) => {
          const widget = props.widgets?.find((w) => w.id === id);
          if (widget) {
            return (
              <div key={index}>
                <Waypoint
                  onEnter={() => {
                    if (props.setActiveWidgetId) {
                      props.setActiveWidgetId(widget.id);
                    }
                  }}
                  topOffset={props.topOffset}
                  bottomOffset={props.bottomOffset}
                  fireOnRapidScroll={false}
                >
                  <div className="margin-top-4 usa-prose" id={id}>
                    <WidgetRender
                      widget={widget}
                      showMobilePreview={props.showMobilePreview}
                      bottomOffset={props.bottomOffset}
                      topOffset={props.topOffset}
                    />
                  </div>
                </Waypoint>
              </div>
            );
          }
          return false;
        })}
      {content.showWithTabs &&
        (content.horizontally ||
          props.showMobilePreview ||
          windowSize.width <= 600) &&
        content.widgetIds?.length > 0 && (
          <Tabs
            defaultActive={activeTabId}
            showArrows
            activeColor={`${primaryColor}`}
            container={t("Section")}
          >
            {content.widgetIds.map((id: string, index: number) => {
              const widget = props.widgets?.find((w) => w.id === id);
              if (widget) {
                return (
                  <div key={index} id={`${index}`} label={widget.name}>
                    <WidgetRender
                      widget={widget}
                      showMobilePreview={props.showMobilePreview}
                      hideTitle={true}
                    />
                  </div>
                );
              }
              return false;
            })}
          </Tabs>
        )}
      {content.showWithTabs &&
        !content.horizontally &&
        !props.showMobilePreview &&
        windowSize.width > 600 &&
        content.widgetIds && (
          <TabsVertical
            defaultActive={activeTabId}
            activeColor={`${primaryColor}`}
          >
            {content.widgetIds.map((id: string, index: number) => {
              const widget = props.widgets?.find((w) => w.id === id);
              if (widget) {
                return (
                  <div key={index} id={`${index}`} label={widget.name}>
                    <WidgetRender
                      widget={widget}
                      showMobilePreview={props.showMobilePreview}
                      hideTitle={true}
                    />
                  </div>
                );
              }
              return false;
            })}
          </TabsVertical>
        )}
    </div>
  );
}

export default SectionWidget;
