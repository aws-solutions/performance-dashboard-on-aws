import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSampleDataset, useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import Combobox from "../components/Combobox";
import BarChartWidget from "../components/BarChartWidget";
import ColumnChartWidget from "../components/ColumnChartWidget";
import ColorPaletteService from "../services/ColorPaletteService";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";

interface FormValues {
  primary: string;
  secondary: string;
}

const EDIT_COLORS_CSV_COLUMN = "EditColors-CSV-Column.csv";
const EDIT_COLORS_CSV_BAR = "EditColors-CSV-Bar.csv";

function EditColors() {
  const { t } = useTranslation();
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const datasetColumn = useSampleDataset(EDIT_COLORS_CSV_COLUMN);
  const datasetBar = useSampleDataset(EDIT_COLORS_CSV_BAR);
  const { register, errors, handleSubmit, watch } = useForm<FormValues>();
  const primaryColor = watch("primary");
  const secondaryColor = watch("secondary");

  const onSubmit = async (values: FormValues) => {
    await BackendService.updateSetting(
      "colors",
      {
        primary: values.primary,
        secondary: values.secondary,
      },
      new Date()
    );

    history.push("/admin/settings/brandingandstyling", {
      alert: {
        type: "success",
        message: t("SettingsColorEditSuccess"),
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/settings/brandingandstyling");
  };

  const crumbs = [
    {
      label: t("Settings"),
      url: "/admin/settings",
    },
    {
      label: t("BrandingAndStyle"),
      url: "/admin/settings/brandingandstyling",
    },
    {
      label: t("SettingsColorsEdit"),
    },
  ];

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1 id="settingsColorsLabel">{t("SettingsColorsEdit")}</h1>

        <p>{t("SettingsColorsDescription")}</p>
      </div>

      {loadingSettings && datasetColumn && datasetBar ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div className="grid-row width-desktop">
          <div className="grid-col-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditColorsForm"
              aria-labelledby="settingsColorsLabel"
            >
              <label htmlFor="primary" className="usa-label text-bold">
                {t("SettingsColorsPrimaryColor")}
                <span>&#42;</span>
              </label>
              <div className="usa-hint">
                {t("SettingsColorsPrimaryColorDescription")}
                <div>
                  <Link to="/admin/colorshelp" target="_blank" external>
                    {t("SettingsColorsPrimaryColorLink")}
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
                        ? t("SettingsColorsPrimaryColorInvalid")
                        : t("SettingsColorsPrimaryColorEmpty"))
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
                {t("SettingsColorsSecondColor")}
              </label>
              <div className="usa-hint">
                {t("SettingsColorsSecondColorDescription")}
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
                      margin: "30px 10px 10px 10px",
                      width: 25,
                      height: 25,
                    }}
                  ></div>
                </div>
              </div>

              <br />
              <Button type="submit" disabled={loadingSettings}>
                {t("Save")}
              </Button>
              <Button
                variant="unstyled"
                type="button"
                className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
                onClick={onCancel}
              >
                {t("Cancel")}
              </Button>
            </form>
          </div>
          <div className="grid-col-6">
            <div className="grid-row">
              <div className="grid-col-5">
                <BarChartWidget
                  title=""
                  downloadTitle="Edit colors bar sample"
                  summary=""
                  bars={datasetBar.dataset.headers}
                  data={datasetBar.dataset.data}
                  summaryBelow={false}
                  hideLegend={true}
                  colors={{ primary: primaryColor, secondary: secondaryColor }}
                  columnsMetadata={[]}
                  significantDigitLabels={false}
                  hideDataLabels={true}
                />
              </div>
              <div className="grid-col-7">
                <ColumnChartWidget
                  title=""
                  downloadTitle="Edit colors column sample"
                  summary=""
                  columns={datasetColumn.dataset.headers}
                  data={datasetColumn.dataset.data}
                  summaryBelow={false}
                  hideLegend={true}
                  colors={{ primary: primaryColor, secondary: secondaryColor }}
                  columnsMetadata={[]}
                  significantDigitLabels={false}
                  hideDataLabels={true}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditColors;
