/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Widget,
  WidgetType,
  ChartWidget,
  TableWidget,
  ImageWidget,
  MetricsWidget,
} from "../models";
import { useWidgetDataset, useImage } from "../hooks";
import ChartWidgetComponent from "../components/ChartWidget";
import TableWidgetComponent from "../components/TableWidget";
import TextWidget from "../components/TextWidget";
import SectionWidget from "../components/SectionWidget";
import ImageWidgetComponent from "../components/ImageWidget";
import MetricsWidgetComponent from "../components/MetricsWidget";
import Utils from "../services/UtilsService";
import styles from "./WidgetRender.module.scss";

interface Props {
  widget: Widget;
  showMobilePreview?: boolean;
  hideTitle?: boolean;
  widgets?: Array<Widget>;
  setActiveWidgetId?: Function;
  topOffset?: string;
  bottomOffset?: string;
  defaultActive?: string;
  disableShare?: boolean;
}

function WidgetRender({
  widget,
  showMobilePreview,
  widgets,
  hideTitle,
  setActiveWidgetId,
  bottomOffset,
  topOffset,
  defaultActive,
  disableShare,
}: Props) {
  function getWidget() {
    switch (widget.widgetType) {
      case WidgetType.Text:
        return <TextWidget widget={widget} hideTitle={hideTitle} />;
      case WidgetType.Chart:
        return (
          <ChartWidgetComponent
            widget={widget as ChartWidget}
            showMobilePreview={showMobilePreview}
            hideTitle={hideTitle}
          />
        );
      case WidgetType.Table:
      case WidgetType.Metrics:
        return (
          <WidgetWithDataset
            widget={widget}
            showMobilePreview={showMobilePreview}
            hideTitle={hideTitle}
          />
        );
      case WidgetType.Image:
        return (
          <WidgetWithImage
            widget={widget as ImageWidget}
            hideTitle={hideTitle}
          />
        );
      case WidgetType.Section:
        return (
          <SectionWidget
            widget={widget}
            showMobilePreview={showMobilePreview}
            widgets={widgets}
            setActiveWidgetId={setActiveWidgetId}
            bottomOffset={bottomOffset}
            topOffset={topOffset}
            defaultActive={defaultActive}
          />
        );
      default:
        return null;
    }
  }

  if (!!disableShare) {
    return getWidget();
  }

  return <div className={styles.widgetContainer}>{getWidget()}</div>;
}

function WidgetWithImage({ widget, hideTitle }: Props) {
  const imageWidget = widget as ImageWidget;
  const content = imageWidget.content;
  const file = useImage(content.s3Key.raw);

  const imageId = `image-${Utils.getShorterId(widget.id)}`;
  return (
    <ImageWidgetComponent
      id={imageId}
      title={!hideTitle && imageWidget.showTitle ? content.title : ""}
      summary={content.summary ? content.summary : ""}
      summaryBelow={content.summaryBelow}
      file={file.file}
      altText={content.imageAltText}
      scalePct={content.scalePct ? content.scalePct : "auto"}
    />
  );
}

function WidgetWithDataset({ widget, showMobilePreview, hideTitle }: Props) {
  const { json } = useWidgetDataset(widget);
  switch (widget.widgetType) {
    case WidgetType.Table:
      const tableWidget = widget as TableWidget;
      const tableId = `table-${Utils.getShorterId(widget.id)}`;
      return (
        <TableWidgetComponent
          id={tableId}
          title={
            !hideTitle && tableWidget.showTitle ? tableWidget.content.title : ""
          }
          summary={tableWidget.content.summary}
          data={json}
          summaryBelow={tableWidget.content.summaryBelow}
          columnsMetadata={tableWidget.content.columnsMetadata}
          sortByColumn={tableWidget.content.sortByColumn}
          sortByDesc={tableWidget.content.sortByDesc}
          significantDigitLabels={tableWidget.content.significantDigitLabels}
          displayWithPages={tableWidget.content.displayWithPages}
          showMobilePreview={showMobilePreview}
        />
      );
    case WidgetType.Metrics:
      const metricsWidget = widget as MetricsWidget;
      const metricsId = `metrics-${Utils.getShorterId(widget.id)}`;
      return (
        <MetricsWidgetComponent
          id={metricsId}
          title={
            !hideTitle && metricsWidget.showTitle
              ? metricsWidget.content.title
              : ""
          }
          metrics={json}
          metricPerRow={
            metricsWidget.content.oneMetricPerRow ||
            window.innerWidth < 640 ||
            showMobilePreview
              ? 1
              : 3
          }
          significantDigitLabels={metricsWidget.content.significantDigitLabels}
          metricsCenterAlign={metricsWidget.content.metricsCenterAlign}
        />
      );
    default:
      return null;
  }
}

export default WidgetRender;
