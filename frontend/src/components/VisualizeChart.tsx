import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { ChartType, DatasetType } from "../models";
import { useTranslation } from "react-i18next";
import Alert from "./Alert";
import BarChartWidget from "./BarChartWidget";
import Button from "./Button";
import ColumnChartWidget from "./ColumnChartWidget";
import LineChartWidget from "./LineChartWidget";
import Link from "./Link";
import PartWholeChartWidget from "./PartWholeChartWidget";
import RadioButtons from "./RadioButtons";
import Spinner from "./Spinner";
import TextField from "./TextField";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";
import DatasetParsingService from "../services/DatasetParsingService";
import PrimaryActionBar from "./PrimaryActionBar";

interface Props {
  errors: any;
  register: Function;
  json: Array<any>;
  originalJson: Array<any>;
  headers: Array<string>;
  csvJson: Array<any>;
  datasetLoading: boolean;
  datasetType: DatasetType | undefined;
  onCancel: Function;
  backStep: Function;
  advanceStep: Function;
  fileLoading: boolean;
  processingWidget: boolean;
  fullPreviewButton: JSX.Element;
  fullPreview: boolean;
  submitButtonLabel: string;
  sortByColumn?: string;
  sortByDesc?: boolean;
  setSortByColumn: Function;
  setSortByDesc: Function;
  title: string;
  summary: string;
  chartType: ChartType;
  showTitle: boolean;
  summaryBelow: boolean;
  significantDigitLabels: boolean;
  horizontalScroll: boolean;
  columnsMetadata: Array<any>;
  configHeader: JSX.Element;
}

function VisualizeChart(props: Props) {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(true);
  const [widthPercent, setWidthPercent] = useState(0);

  const handleSortDataChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.value !== "") {
      const sortData = target.value.split("###");
      const header = sortData[0];
      const desc = sortData[1] === "desc";
      props.setSortByColumn(header);
      props.setSortByDesc(desc);
    } else {
      props.setSortByColumn(undefined);
      props.setSortByDesc(undefined);
    }
  };

  return (
    <div className="grid-row width-desktop">
      <div className="grid-col-5" hidden={props.fullPreview}>
        <PrimaryActionBar>
          {props.configHeader}
          {props.errors.title ? (
            <Alert
              type="error"
              message="Resolve error(s) to add the chart"
            ></Alert>
          ) : (
            ""
          )}

          <TextField
            id="title"
            name="title"
            label="Chart title"
            hint="Give your chart a descriptive title."
            error={props.errors.title && "Please specify a chart title"}
            required
            register={props.register}
          />

          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="display-title"
              type="checkbox"
              name="showTitle"
              defaultChecked={true}
              ref={props.register()}
            />
            <label className="usa-checkbox__label" htmlFor="display-title">
              Show title on dashboard
            </label>
          </div>

          <RadioButtons
            id="chartType"
            name="chartType"
            label="Chart type"
            hint="Choose a chart type."
            register={props.register}
            error={props.errors.chartType && "Please select a chart type"}
            defaultValue={ChartType.LineChart}
            required
            options={[
              {
                value: ChartType.BarChart,
                label: "Bar",
              },
              {
                value: ChartType.ColumnChart,
                label: "Column",
              },
              {
                value: ChartType.LineChart,
                label: "Line",
              },
              {
                value: ChartType.PartWholeChart,
                label: "Part-to-whole",
              },
            ]}
          />
          <div className="margin-top-3">
            <Dropdown
              id="sortData"
              name="sortData"
              label="Sort data"
              options={DatasetParsingService.getDatasetSortOptions(
                props.originalJson,
                props.headers
              )}
              onChange={handleSortDataChange}
              defaultValue={
                props.sortByColumn
                  ? `${props.sortByColumn}###${
                      props.sortByDesc ? "desc" : "asc"
                    }`
                  : ""
              }
              register={props.register}
            />
          </div>

          <div>
            <label className="usa-label text-bold">
              {t("ChartOptionsLabel")}
            </label>
            <div className="usa-hint">{t("ChartOptionsDescription")}</div>
            <div className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                id="significantDigitLabels"
                type="checkbox"
                name="significantDigitLabels"
                defaultChecked={false}
                ref={props.register()}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="significantDigitLabels"
              >
                {t("SignificantDigitLabels")}
              </label>
            </div>

            <div
              className="usa-checkbox"
              hidden={
                (props.chartType !== ChartType.LineChart &&
                  props.chartType !== ChartType.ColumnChart) ||
                widthPercent <= 100
              }
            >
              <input
                className="usa-checkbox__input"
                id="horizontalScroll"
                type="checkbox"
                name="horizontalScroll"
                defaultChecked
                ref={props.register()}
              />
              <label className="usa-checkbox__label" htmlFor="horizontalScroll">
                Display with horizontal scroll
              </label>
            </div>
          </div>

          <TextField
            id="summary"
            name="summary"
            label="Chart summary - optional"
            hint={
              <>
                Give your chart a summary to explain it in more depth. It can
                also be read by screen readers to describe the chart for those
                with visual impairments. This field supports markdown.{" "}
                <Link target="_blank" to={"/admin/markdown"} external>
                  View Markdown Syntax
                </Link>
              </>
            }
            register={props.register}
            multiline
            rows={5}
          />
          <div className="usa-checkbox">
            <input
              className="usa-checkbox__input"
              id="summary-below"
              type="checkbox"
              name="summaryBelow"
              defaultChecked={false}
              ref={props.register()}
            />
            <label className="usa-checkbox__label" htmlFor="summary-below">
              Show summary below chart
            </label>
          </div>
          <br />
          <br />
          <hr />
          <Button variant="outline" type="button" onClick={props.backStep}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={
              !props.json.length || props.fileLoading || props.processingWidget
            }
          >
            {props.submitButtonLabel}
          </Button>
          <Button
            variant="unstyled"
            className="text-base-dark hover:text-base-darker active:text-base-darkest"
            type="button"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </PrimaryActionBar>
      </div>
      <div className={props.fullPreview ? "grid-col-12" : "grid-col-7"}>
        <div
          hidden={!props.json.length}
          className={`${!props.fullPreview ? "margin-left-4" : ""}`}
        >
          {props.fullPreviewButton}
          <h4>Preview</h4>
          {props.datasetLoading ? (
            <Spinner className="text-center margin-top-6" label="Loading" />
          ) : (
            <>
              {showAlert &&
              props.datasetType === DatasetType.StaticDataset &&
              props.csvJson.length ? (
                <Alert
                  type="info"
                  message={
                    <div className="grid-row margin-left-4">
                      <div className="grid-col-11">
                        Does the chart look correct?{" "}
                        <Link
                          to="/admin/formattingcsv"
                          target="_blank"
                          external
                        >
                          Learn how to format your CSV data.
                        </Link>
                      </div>
                      <div className="grid-col-1">
                        <div className="margin-left-4">
                          <Button
                            variant="unstyled"
                            className="margin-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                            onClick={() => setShowAlert(false)}
                            type="button"
                            ariaLabel="Close"
                          >
                            <FontAwesomeIcon icon={faTimes} size="sm" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  }
                  slim
                />
              ) : (
                ""
              )}
              {props.chartType === ChartType.LineChart && (
                <LineChartWidget
                  title={props.showTitle ? props.title : ""}
                  summary={props.summary}
                  lines={
                    props.json.length
                      ? (Object.keys(props.json[0]) as Array<string>)
                      : []
                  }
                  data={props.json}
                  summaryBelow={props.summaryBelow}
                  isPreview={!props.fullPreview}
                  horizontalScroll={props.horizontalScroll}
                  setWidthPercent={setWidthPercent}
                  significantDigitLabels={props.significantDigitLabels}
                  columnsMetadata={props.columnsMetadata}
                />
              )}
              {props.chartType === ChartType.ColumnChart && (
                <ColumnChartWidget
                  title={props.showTitle ? props.title : ""}
                  summary={props.summary}
                  columns={
                    props.json.length
                      ? (Object.keys(props.json[0]) as Array<string>)
                      : []
                  }
                  data={props.json}
                  summaryBelow={props.summaryBelow}
                  isPreview={!props.fullPreview}
                  horizontalScroll={props.horizontalScroll}
                  setWidthPercent={setWidthPercent}
                  significantDigitLabels={props.significantDigitLabels}
                  columnsMetadata={props.columnsMetadata}
                />
              )}
              {props.chartType === ChartType.BarChart && (
                <BarChartWidget
                  title={props.showTitle ? props.title : ""}
                  summary={props.summary}
                  bars={
                    props.json.length
                      ? (Object.keys(props.json[0]) as Array<string>)
                      : []
                  }
                  data={props.json}
                  summaryBelow={props.summaryBelow}
                  significantDigitLabels={props.significantDigitLabels}
                  columnsMetadata={props.columnsMetadata}
                />
              )}
              {props.chartType === ChartType.PartWholeChart && (
                <PartWholeChartWidget
                  title={props.showTitle ? props.title : ""}
                  summary={props.summary}
                  parts={
                    props.json.length
                      ? (Object.keys(props.json[0]) as Array<string>)
                      : []
                  }
                  data={props.json}
                  summaryBelow={props.summaryBelow}
                  significantDigitLabels={props.significantDigitLabels}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizeChart;
