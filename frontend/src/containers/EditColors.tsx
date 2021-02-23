import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSampleDataset, useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import Combobox from "../components/Combobox";
import BarChartPreview from "../components/BarChartPreview";
import ColumnChartPreview from "../components/ColumnChartPreview";
import ColorPaletteService from "../services/ColorPaletteService";
import Link from "../components/Link";

interface FormValues {
  primary: string;
  secondary: string;
}

const EDIT_COLORS_CSV_COLUMN = "EditColors-CSV-Column.csv";
const EDIT_COLORS_CSV_BAR = "EditColors-CSV-Bar.csv";

function EditColors() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const datasetColumn = useSampleDataset(EDIT_COLORS_CSV_COLUMN);
  const datasetBar = useSampleDataset(EDIT_COLORS_CSV_BAR);
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(
    undefined
  );
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>(
    undefined
  );
  const { register, errors, handleSubmit, getValues } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    await BackendService.updateSetting(
      "colors",
      {
        primary: values.primary,
        secondary: values.secondary,
      },
      new Date()
    );

    history.push("/admin/settings/topicarea", {
      alert: {
        type: "success",
        message: "Colors were successfully edited",
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/topicarea");
  };

  const onFormChange = () => {
    const { primary, secondary } = getValues();
    if (ColorPaletteService.rgbHexColorIsValid(primary)) {
      setPrimaryColor(primary);
    }
    setSecondaryColor(secondary);
  };

  const crumbs = [
    {
      label: "Settings",
      url: "/admin/settings/topicarea",
    },
    {
      label: "Branding and style",
      url: "/admin/settings/topicarea",
    },
    {
      label: "Edit colors",
    },
  ];

  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <h1>Edit colors</h1>

      <p>
        Customize these colors to make your dashboards appear similar in style
        to your organization's branch or color palette.
      </p>

      {loadingSettings && datasetColumn && datasetBar ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <div className="grid-row width-desktop">
          <div className="grid-col-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onChange={onFormChange}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditColorsForm"
            >
              <label htmlFor="primary" className="usa-label text-bold">
                Primary color
              </label>
              <div className="usa-hint">
                This color will be the first color used in data visualizations
                and the color of buttons. Must be a valid HEX color (Ex.
                #00FF00, #0f0).
                <div>
                  <Link to="/admin/colorshelp" target="_blank" external>
                    Learn more
                  </Link>
                </div>
              </div>

              <div className="grid-row">
                <div className="grid-col flex-11">
                  <TextField
                    id="primary"
                    name="primary"
                    label=""
                    error={
                      errors.primary &&
                      (errors.primary.type === "validate"
                        ? "Color is not a valid HEX color value"
                        : "Please specify a color")
                    }
                    defaultValue={settings.colors && settings.colors.primary}
                    register={register}
                    required
                    validate={ColorPaletteService.rgbHexColorIsValid}
                  />
                </div>
                <div className="grid-col flex-1">
                  <div
                    className="radius-md"
                    style={{
                      backgroundColor: primaryColor,
                      margin: "32px 10px 10px 10px",
                      width: 25,
                      height: 25,
                    }}
                  ></div>
                </div>
              </div>

              <label htmlFor="secondary" className="usa-label text-bold">
                Data visualization second color
              </label>
              <div className="usa-hint">
                Choose a color that will follow your primary color in
                categorical data visualizations. These color were chosen to meet
                accessibility standards.
              </div>

              <div className="grid-row">
                <div className="grid-col flex-11">
                  <Combobox
                    id="secondary"
                    name="secondary"
                    label=""
                    options={ColorPaletteService.getSecondaryOptions(
                      primaryColor
                    )}
                    defaultValue={settings.colors && settings.colors.secondary}
                    register={register}
                  />
                </div>
                <div className="grid-col flex-1">
                  <div
                    className="radius-md"
                    style={{
                      backgroundColor: secondaryColor,
                      margin: "16px 10px 10px 10px",
                      width: 25,
                      height: 25,
                    }}
                  ></div>
                </div>
              </div>

              <br />
              <Button type="submit" disabled={loadingSettings}>
                Save
              </Button>
              <Button
                variant="unstyled"
                type="button"
                className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </form>
          </div>
          <div className="grid-col-6">
            <div className="grid-row">
              <div className="grid-col-5">
                <BarChartPreview
                  title=""
                  summary=""
                  bars={datasetBar.dataset.headers}
                  data={datasetBar.dataset.data}
                  summaryBelow={false}
                  hideLegend={true}
                  colors={{ primary: primaryColor, secondary: secondaryColor }}
                />
              </div>
              <div className="grid-col-7">
                <ColumnChartPreview
                  title=""
                  summary=""
                  columns={datasetColumn.dataset.headers}
                  data={datasetColumn.dataset.data}
                  summaryBelow={false}
                  hideLegend={true}
                  colors={{ primary: primaryColor, secondary: secondaryColor }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditColors;
