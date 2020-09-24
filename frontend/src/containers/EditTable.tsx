import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Dataset } from "../models";
import BadgerService from "../services/BadgerService";
import StorageService from "../services/StorageService";
import AdminLayout from "../layouts/Admin";
import Breadcrumbs from "../components/Breadcrumbs";
import TextField from "../components/TextField";
import FileInput from "../components/FileInput";
import Button from "../components/Button";
import { parse, ParseResult } from "papaparse";
import TablePreview from "../components/TablePreview";
import { useWidget } from "../hooks";

interface FormValues {
  title: string;
}

function EditTable() {
  const history = useHistory();
  const { dashboardId, widgetId } = useParams();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [dataset, setDataset] = useState<Array<object> | undefined>(undefined);
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileProcessed = useCallback(async (data: File, title: string) => {
    if (!data) {
      return;
    }
    parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      comments: "#",
      complete: function (results: ParseResult<object>) {
        if (results.errors.length) {
          setCsvErrors(results.errors);
          setDataset(undefined);
        } else {
          setCsvErrors(undefined);
          title && setTitle(title);
          setDataset(results.data);
        }
      },
    });
    setCsvFile(data);
  }, []);

  const { widget } = useWidget(dashboardId, widgetId, onFileProcessed);

  const uploadDataset = async (): Promise<Dataset> => {
    if (!csvFile) {
      throw new Error("CSV file not specified");
    }

    if (!csvFile.lastModified) {
      return {
        id: widget?.content.datasetId,
        fileName: csvFile.name,
        s3Key: widget?.content.s3Key,
      };
    }

    setLoading(true);
    const uploadResponse = await StorageService.uploadDataset(
      csvFile,
      JSON.stringify(dataset)
    );

    const newDataset = await BadgerService.createDataset(csvFile.name, {
      raw: uploadResponse.s3Keys.raw,
      json: uploadResponse.s3Keys.json,
    });

    setLoading(false);
    return newDataset;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const newDataset = await uploadDataset();
      await BadgerService.editWidget(
        dashboardId,
        widgetId,
        values.title,
        {
          title: values.title,
          datasetId: newDataset.id,
          s3Key: newDataset.s3Key,
        },
        widget ? widget.updatedAt : new Date()
      );
    } catch (err) {
      console.log("Failed to edit widget", err);
    }

    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      <h1>Edit content item</h1>
      <div className="grid-row width-desktop">
        <div className="grid-col-6">
          <form
            className="usa-form usa-form--large"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="usa-fieldset">
              <TextField
                id="title"
                name="title"
                label="Table title"
                hint="Give your table a descriptive title."
                error={errors.title && "Please specify a table title"}
                onChange={handleChange}
                defaultValue={widget?.name}
                required
                register={register}
              />

              <FileInput
                id="dataset"
                name="dataset"
                label="File upload"
                accept=".csv"
                loading={loading}
                errors={csvErrors}
                register={register}
                hint="Must be a CSV file. [Link] How do I format my CSV?"
                fileName={csvFile && csvFile.name}
                onFileProcessed={onFileProcessed}
              />

              <div hidden={!dataset}>
                {dataset &&
                dataset.length &&
                (Object.keys(dataset[0]) as Array<string>).length >= 8 ? (
                  <div className="usa-alert usa-alert--warning margin-top-3">
                    <div className="usa-alert__body">
                      <p className="usa-alert__text">
                        It is recommended that tables have less than 8 columns.
                        You can still continue.
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </fieldset>
            <br />
            <hr />
            <Button disabled={!dataset || loading} type="submit">
              Save
            </Button>
            <Button variant="unstyled" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </div>
        <div className="grid-col-6">
          <div hidden={!dataset} className="margin-left-4">
            <h4>Preview</h4>
            <TablePreview
              title={title}
              headers={
                dataset && dataset.length
                  ? (Object.keys(dataset[0]) as Array<string>)
                  : []
              }
              data={dataset}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditTable;
