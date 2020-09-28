import React, { useState } from "react";
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

interface FormValues {
  title: string;
}

function AddTable() {
  const history = useHistory();
  const { dashboardId } = useParams();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [dataset, setDataset] = useState<Array<object> | undefined>(undefined);
  const [csvErrors, setCsvErrors] = useState<Array<object> | undefined>(
    undefined
  );
  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadDataset = async (): Promise<Dataset> => {
    if (!csvFile) {
      throw new Error("CSV file not specified");
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
      await BadgerService.createWidget(dashboardId, values.title, "Table", {
        title: values.title,
        datasetId: newDataset.id,
        s3Key: newDataset.s3Key,
      });
    } catch (err) {
      console.log("Failed to save widget", err);
    }

    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const goBack = () => {
    history.push(`/admin/dashboard/${dashboardId}/add-content`);
  };

  const onCancel = () => {
    history.push(`/admin/dashboard/edit/${dashboardId}`);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  const onFileProcessed = (data: File) => {
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
          setDataset(results.data);
        }
      },
    });
    setCsvFile(data);
  };

  return (
    <AdminLayout>
      <Breadcrumbs />
      <h1>Add content</h1>
      <div className="text-base text-italic">Step 2 of 2</div>
      <div className="margin-y-1 text-semibold display-inline-block font-sans-lg">
        Configure table
      </div>
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
                required
                register={register}
              />

              <FileInput
                id="dataset"
                name="dataset"
                label="File upload"
                accept=".csv"
                disabled={!title}
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
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
            <Button disabled={!dataset || loading} type="submit">
              Add table
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

export default AddTable;
