import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSettings } from "../hooks";
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import Spinner from "../components/Spinner";
import TextField from "../components/TextField";
import Combobox from "../components/Combobox";

interface FormValues {
  primary: string;
  secondary: string;
}

function EditColors() {
  const history = useHistory();
  const { settings, loadingSettings } = useSettings();
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(
    undefined
  );
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>(
    undefined
  );
  const { register, errors, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (settings) {
      const primary = (settings.colors && settings.colors.primary) || "#2491ff";
      const secondary =
        (settings.colors && settings.colors.secondary) || "#54278f";

      reset({
        primary,
        secondary,
      });

      setPrimaryColor(primary);
      setSecondaryColor(secondary);
    }
  }, [settings, reset]);

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

  const onEditPrimaryColor = async (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    event.persist();
    setPrimaryColor((event.target as HTMLInputElement).value);
    event.stopPropagation();
  };

  const onEditSecondaryColor = async (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    event.persist();
    setSecondaryColor((event.target as HTMLInputElement).value);
    event.stopPropagation();
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
    <div className="grid-row">
      <div className="grid-col-8">
        <Breadcrumbs crumbs={crumbs} />
        <h1>Edit colors</h1>

        <p>
          Customize these colors to make your dashboards appear similar in style
          to your organization's branch or color palette.
        </p>

        {loadingSettings ? (
          <Spinner className="text-center margin-top-9" label="Loading" />
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="edit-homepage-content-form usa-form usa-form--large"
              data-testid="EditColors"
            >
              <TextField
                id="primary"
                name="primary"
                label="Primary color"
                hint="This color will be the first color used in data visualizations and the color of buttons. Must be a valid HEX color (Ex #00FF00, #0f0)."
                error={errors.primary && "Please specify a color"}
                defaultValue={primaryColor}
                register={register}
                onChange={onEditPrimaryColor}
                required
              />

              <label htmlFor="fieldset" className="usa-label text-bold">
                Data visualization second color
              </label>
              <div className="usa-hint">
                Choose a color that will follow your primary color in
                categorical data visualizations. These color were chosen to meet
                accessibility standards.
              </div>

              <Combobox
                id="secondary"
                name="secondary"
                label=""
                options={[
                  {
                    value: "#2491ff",
                    content: "#2491ff",
                  },
                  {
                    value: "#54278f",
                    content: "#54278f",
                  },
                  {
                    value: "#c05600",
                    content: "#c05600",
                  },
                  {
                    value: "#002d3f",
                    content: "#002d3f",
                  },
                  {
                    value: "#00a398",
                    content: "#00a398",
                  },
                  {
                    value: "#c2850c",
                    content: "#c2850c",
                  },
                  {
                    value: "#fd4496",
                    content: "#fd4496",
                  },
                  {
                    value: "#3e4ded",
                    content: "#3e4ded",
                  },
                  {
                    value: "#008817",
                    content: "#008817",
                  },
                  {
                    value: "#5c1111",
                    content: "#5c1111",
                  },
                  {
                    value: "#e52207",
                    content: "#e52207",
                  },
                  {
                    value: "#ab2165",
                    content: "#ab2165",
                  },
                  {
                    value: "#0f6460",
                    content: "#0f6460",
                  },
                ]}
                defaultValue="#54278f"
                register={register}
                onChange={onEditSecondaryColor}
              />
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
          </>
        )}
      </div>
    </div>
  );
}

export default EditColors;
