import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, MouseEvent } from "react";
import { DatasetType } from "../models";
import { useTranslation } from "react-i18next";
import Alert from "./Alert";
import Button from "./Button";
import Link from "./Link";
import Spinner from "./Spinner";
import TextField from "./TextField";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TableWidget from "./TableWidget";
import Dropdown from "./Dropdown";
import DatasetParsingService from "../services/DatasetParsingService";
import PrimaryActionBar from "./PrimaryActionBar";
import { useWindowSize } from "../hooks";
import UtilsService from "../services/UtilsService";

interface Props {
  widgetId: string;
  errors: any;
  register: Function;
  json: Array<any>;
  originalJson: Array<any>;
  headers: Array<string>;
  csvJson: Array<any>;
  datasetLoading: boolean;
  datasetType: DatasetType | undefined;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  backStep: (event: MouseEvent<HTMLButtonElement>) => void;
  advanceStep: Function;
  fileLoading: boolean;
  processingWidget: boolean;
  fullPreviewButton: JSX.Element;
  fullPreview: boolean;
  previewPanelId: string;
  submitButtonLabel: string;
  sortByColumn?: string;
  sortByDesc?: boolean;
  setSortByColumn: Function;
  setSortByDesc: Function;
  title: string;
  summary: string;
  showTitle: boolean;
  summaryBelow: boolean;
  columnsMetadata: Array<any>;
  significantDigitLabels: boolean;
  displayWithPages: boolean;
  configHeader: JSX.Element;
}

function VisualizeTable(props: Props) {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(true);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

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
    <div className="grid-row">
      <div className="tablet:grid-col-6" hidden={props.fullPreview}>
        <PrimaryActionBar>
          {props.configHeader}
          {props.errors.title && (
            <Alert
              type="error"
              message={t("VisualizeTableComponent.ResolveErrors")}
              slim
            ></Alert>
          )}

          <fieldset className="usa-fieldset">
            <legend
              className={`usa-hint ${isMobile ? "grid-col-12" : "grid-col-6"}`}
            >
              {t("AddTableScreen.Configure")}
            </legend>

            <TextField
              id="title"
              name="title"
              label={t("VisualizeTableComponent.TableTitle")}
              hint={t("VisualizeTableComponent.TableTitleHint")}
              error={
                props.errors.title &&
                t("VisualizeTableComponent.TableTitleError")
              }
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
                {t("AddTextScreen.ShowTitle")}
              </label>
            </div>

            <div className="margin-top-3 grid-col-6">
              <Dropdown
                id="sortData"
                name="sortData"
                label={t("SortData")}
                options={DatasetParsingService.getDatasetSortOptions(
                  props.originalJson,
                  props.headers,
                  t
                )}
                onChange={handleSortDataChange}
                defaultValue={UtilsService.getSortData(
                  props.sortByColumn,
                  props.sortByDesc
                )}
                register={props.register}
              />
            </div>

            <div>
              <label className="usa-label text-bold">
                {t("TableOptionsLabel")}
              </label>
              <fieldset className="usa-fieldset">
                <legend className="usa-hint">
                  {t("TableOptionsDescription")}
                </legend>
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
                <div className="usa-checkbox">
                  <input
                    className="usa-checkbox__input"
                    id="displayWithPages"
                    type="checkbox"
                    name="displayWithPages"
                    defaultChecked={false}
                    ref={props.register()}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="displayWithPages"
                  >
                    {t("DisplayWithPages")}
                  </label>
                </div>
              </fieldset>
            </div>

            <TextField
              id="summary"
              name="summary"
              label={t("VisualizeTableComponent.TableSummary")}
              hint={
                <>
                  {t("VisualizeTableComponent.TableSummaryHint")}{" "}
                  <Link target="_blank" to={"/admin/markdown"} external>
                    {t("AddTextScreen.ViewMarkdownSyntax")}
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
                {t("VisualizeTableComponent.TableShowSummary")}
              </label>
            </div>
            <br />
            <br />
            <hr />
            <Button
              variant="outline"
              type="button"
              onClick={props.backStep}
              className="margin-top-1"
            >
              {t("BackButton")}
            </Button>
            <Button
              type="submit"
              disabled={
                !props.json.length ||
                props.fileLoading ||
                props.processingWidget
              }
              className="margin-top-1"
            >
              {props.submitButtonLabel}
            </Button>
            <Button
              variant="unstyled"
              className="text-base-dark hover:text-base-darker active:text-base-darkest margin-top-1"
              type="button"
              onClick={props.onCancel}
            >
              {t("Cancel")}
            </Button>
          </fieldset>
        </PrimaryActionBar>
      </div>

      <section
        className={
          props.fullPreview ? "tablet:grid-col-12" : "tablet:grid-col-6"
        }
        aria-label={t("ContentPreview")}
      >
        <div
          hidden={!props.json.length}
          className={`${
            !props.fullPreview ? "margin-left-4 sticky-preview" : ""
          }`}
        >
          {isMobile ? <br /> : props.fullPreviewButton}
          <div id={props.previewPanelId}>
            {props.datasetLoading ? (
              <Spinner
                className="text-center margin-top-6"
                label={t("LoadingSpinnerLabel")}
              />
            ) : (
              <>
                {showAlert &&
                props.datasetType === DatasetType.StaticDataset &&
                props.csvJson.length ? (
                  <Alert
                    type="info"
                    message={
                      <div className="grid-row margin-left-6">
                        <div className="grid-col-11">
                          {t("VisualizeTableComponent.TableCorrectDisplay")}{" "}
                          <Link to="/admin/formatting" target="_blank" external>
                            {t("LearnHowToFormatCSV")}
                          </Link>
                        </div>
                        <div className="grid-col-1">
                          <div className="margin-1">
                            <Button
                              variant="unstyled"
                              className="margin-0-important text-base-dark hover:text-base-darker active:text-base-darkest"
                              onClick={() => setShowAlert(false)}
                              type="button"
                              ariaLabel={t("GlobalClose")}
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
                <TableWidget
                  id={props.widgetId}
                  title={props.showTitle ? props.title : ""}
                  summary={props.summary}
                  summaryBelow={props.summaryBelow}
                  data={props.json}
                  columnsMetadata={props.columnsMetadata}
                  sortByColumn={props.sortByColumn}
                  sortByDesc={props.sortByDesc}
                  significantDigitLabels={props.significantDigitLabels}
                  displayWithPages={props.displayWithPages}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default VisualizeTable;
