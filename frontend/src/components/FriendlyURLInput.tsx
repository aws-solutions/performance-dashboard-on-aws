import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";

interface Props {
  value?: string;
  onChange?: Function;
  showWarning?: boolean;
}

interface FormValues {
  friendlyURL: string;
}

function FriendlyURLInput({ value, onChange, showWarning }: Props) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { register, reset, errors, getValues, trigger, setValue } =
    useForm<FormValues>({
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

  return (
    <>
      <Modal
        isOpen={isEditing}
        title={t("EditURLComponent.EditURL")}
        buttonType={t("Save")}
        buttonAction={onSubmit}
        closeModal={() => setIsEditing(false)}
        message={
          <div className="usa-form-group">
            <label htmlFor="friendlyURL" className="usa-label text-bold">
              {t("EditURLComponent.DashboardURL")}
            </label>
            <div className="usa-hint">
              {showWarning
                ? t("EditURLComponent.AreYouSure") +
                  t("EditURLComponent.NoAccess")
                : t("EditURLComponent.Guidance")}
            </div>
            {errors.friendlyURL && (
              <span
                className="usa-error-message"
                id="input-error-message"
                role="alert"
              >
                {t("EditURLComponent.Error")}
              </span>
            )}

            <div className="input-group prefix">
              <span className="input-group-addon">
                {window.location.protocol}//{window.location.hostname}/
              </span>
              <input
                id="friendlyURL"
                className="has-prefix"
                name="friendlyURL"
                type="text"
                onChange={(e: any) => sanitizeUrl(e.target.value)}
                style={{ content: "hi" }}
                ref={register({
                  required: true,
                })}
              />
            </div>
          </div>
        }
      />
      <div className="usa-hint">{t("EditURLComponent.Guidance")}</div>
      <p className="font-sans-lg">
        https://{window.location.hostname}/{value}
        <Button
          type="button"
          variant="unstyled"
          className="margin-left-2 text-bold text-base-dark hover:text-base-darker active:text-base-darkest"
          onClick={() => setIsEditing(true)}
        >
          {t("EditURLComponent.EditURL")}
        </Button>
      </p>
    </>
  );
}

export default FriendlyURLInput;
