import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Modal from "./Modal";

interface Props {
  value?: string;
  onChange?: Function;
  showWarning?: boolean;
}

interface FormValues {
  friendlyURL: string;
}

function FriendlyURLInput({ value, onChange, showWarning }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    reset,
    errors,
    watch,
    getValues,
    trigger,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      friendlyURL: value,
    },
  });

  useEffect(() => {
    if (value) {
      reset({
        friendlyURL: value,
      });
    }
  }, [value, reset]);

  const onSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (onChange) {
        const values = getValues();
        onChange(values.friendlyURL);
      }

      setIsEditing(false);
    }
  };

  const sanitizeUrl = (value: string) => {
    let sanitized = value || "";
    sanitized = sanitized.replace(/ /g, "-");
    sanitized = sanitized.toLocaleLowerCase();
    sanitized = sanitized.replace(/[!#$&'\(\)\*\+,\/:;=\?@\[\]]+/g, "");
    setValue("friendlyURL", sanitized);
  };

  const friendlyURL = watch("friendlyURL");

  return (
    <>
      <Modal
        isOpen={isEditing}
        title="Edit URL"
        buttonType="Save"
        buttonAction={onSubmit}
        closeModal={() => setIsEditing(false)}
        message={
          <div className="usa-form-group">
            <label htmlFor="friendlyURL" className="usa-label text-bold">
              Dashboard URL
            </label>
            <div className="usa-hint">
              {showWarning
                ? "Are you sure you want to edit this dashboard's URL? " +
                  "Users will not be able to access the dashboard with the old URL."
                : "Edit the URL that will be used to publish this dashboard"}
            </div>
            {errors.friendlyURL && (
              <span
                className="usa-error-message"
                id="input-error-message"
                role="alert"
              >
                Please enter a valid URL
              </span>
            )}
            <input
              id="friendlyURL"
              className="usa-input"
              name="friendlyURL"
              type="text"
              onChange={(e: any) => sanitizeUrl(e.target.value)}
              ref={register({
                required: true,
              })}
            />
          </div>
        }
      />
      <div className="usa-hint">
        Edit or confirm the URL that will be used to publish this dashboard.
      </div>
      <p className="font-sans-lg margin-top-0">
        {window.location.hostname}/{friendlyURL}
        <Button
          type="button"
          variant="unstyled"
          className="margin-left-2"
          onClick={() => setIsEditing(true)}
        >
          Edit URL
        </Button>
      </p>
    </>
  );
}

export default FriendlyURLInput;
