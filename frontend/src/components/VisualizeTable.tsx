import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { DatasetType } from "../models";
import Alert from "./Alert";
import Button from "./Button";
import Link from "./Link";
import Spinner from "./Spinner";
import TextField from "./TextField";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TableWidget from "./TableWidget";

interface Props {
  errors: any;
  register: Function;
  json: Array<any>;
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
  title?: string;
  summary?: string;
  showTitle?: boolean;
  summaryBelow?: boolean;
}

function VisualizeTable(props: Props) {
  const [showAlert, setShowAlert] = useState(true);
  const [title, setTitle] = useState(props.title || "");
  const [summary, setSummary] = useState(props.summary || "");
  const [showTitle, setShowTitle] = useState(
    props.showTitle === undefined ? true : props.showTitle
  );
  const [summaryBelow, setSummaryBelow] = useState<boolean>(
    props.summaryBelow === undefined ? true : props.summaryBelow
  );

  const handleTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  const handleSummaryChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setSummary((event.target as HTMLTextAreaElement).value);
  };

  const handleSummaryBelowChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setSummaryBelow((event.target as HTMLInputElement).checked);
  };

  const handleShowTitleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setShowTitle((event.target as HTMLInputElement).checked);
  };

  return (
    <div className="grid-row width-desktop">
      <div className="grid-col-5" hidden={props.fullPreview}>
        <TextField
          id="title"
          name="title"
          label="Table title"
          hint="Give your table a descriptive title."
          error={props.errors.title && "Please specify a table title"}
          onChange={handleTitleChange}
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
            onChange={handleShowTitleChange}
            ref={props.register()}
          />
          <label className="usa-checkbox__label" htmlFor="display-title">
            Show title on dashboard
          </label>
        </div>

        <TextField
          id="summary"
          name="summary"
          label="Table summary - optional"
          hint={
            <>
              Give your table a summary to explain it in more depth. This field
              supports markdown.{" "}
              <Link target="_blank" to={"/admin/markdown"} external>
                View Markdown Syntax
              </Link>
            </>
          }
          register={props.register}
          onChange={handleSummaryChange}
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
            onChange={handleSummaryBelowChange}
            ref={props.register()}
          />
          <label className="usa-checkbox__label" htmlFor="summary-below">
            Show summary below table
          </label>
        </div>
        <br />
        <br />
        <hr />
        <Button variant="outline" type="button" onClick={props.backStep}>
          Back
        </Button>
        <Button
          onClick={props.advanceStep}
          type="submit"
          disabled={
            !props.json.length ||
            !title ||
            props.fileLoading ||
            props.processingWidget
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
      </div>

      <div className={props.fullPreview ? "grid-col-12" : "grid-col-7"}>
        <div hidden={!props.json.length} className="margin-left-4">
          {props.fullPreviewButton}
          <h4>Preview</h4>
          {props.datasetLoading ? (
            <Spinner className="text-center margin-top-6" label="Loading" />
          ) : (
            <>
              {showAlert &&
              props.datasetType === DatasetType.StaticDataset &&
              props.csvJson.length ? (
                <div className="margin-left-1">
                  <Alert
                    type="info"
                    message={
                      <div className="grid-row margin-left-4">
                        <div className="grid-col-11">
                          Does the table look correct?
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
                </div>
              ) : (
                ""
              )}
              <TableWidget
                title={showTitle ? title : ""}
                summary={summary}
                summaryBelow={summaryBelow}
                headers={
                  props.json.length
                    ? (Object.keys(props.json[0]) as Array<string>)
                    : []
                }
                data={props.json}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizeTable;
