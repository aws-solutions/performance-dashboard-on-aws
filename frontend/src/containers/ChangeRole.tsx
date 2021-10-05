import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { LocationState, UserRoles } from "../models";
import { useTranslation } from "react-i18next";

interface FormValues {
  emails: string;
  role: string;
}

function ChangeRole() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { register, handleSubmit } = useForm<FormValues>();
  const [role, setRole] = useState("");

  const onSubmit = async (values: FormValues) => {
    const emails = values.emails.split(",").map((email) => email.trim());
    await BackendService.changeRole(values.role, state.usernames!);

    history.push("/admin/users", {
      alert: {
        type: "success",
        message: `${emails.length} ${
          emails.length === 1
            ? t("ChangeRole.Singular")
            : t("ChangeRole.Plural")
        } ${t("ChangeRole.Final")} ${values.role}`,
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/users");
  };

  const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
    setRole((event.target as HTMLInputElement).value);
  };

  if (!state || !state.emails) {
    setTimeout(onCancel, 100);
    return null;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: t("ManageUsers"),
            url: "/admin/users",
          },
          {
            label: t("ChangeRole.Label"),
          },
        ]}
      />

      <h1>{t("ChangeRole.Label")}</h1>
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="usa-form usa-form--large"
            data-testid="ChangeRoleForm"
          >
            <TextField
              id="emails"
              name="emails"
              label={t("AddUsersEmails")}
              multiline
              rows={5}
              defaultValue={state.emails}
              register={register}
              disabled
            />

            <label className="usa-label text-bold">
              {t("ChangeRole.Role")}
            </label>
            <div className="usa-hint">{t("ChangeRole.RoleDescription")}</div>
            <fieldset className="usa-fieldset" onChange={handleChange}>
              <legend className="usa-sr-only">{t("ChangeRole.Roles")}</legend>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    role === UserRoles.Editor ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="editor"
                      value={UserRoles.Editor}
                      type="radio"
                      name="role"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="editor">
                      {t(`ChangeRole.${UserRoles.Editor}`)}
                      <p className="text-base usa-checkbox__label-description">
                        {t("ChangeRole.EditorDescription")}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              <div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    role === UserRoles.Admin ? " bg-base-lightest" : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="admin"
                      value={UserRoles.Admin}
                      type="radio"
                      name="role"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="admin">
                      {t(`ChangeRole.${UserRoles.Admin}`)}
                      <p className="text-base usa-checkbox__label-description">
                        {t("ChangeRole.AdminDescription")}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>

            <br />
            <hr />
            <Button disabled={!role} type="submit">
              {t("Save")}
            </Button>
            <Button
              className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
              variant="unstyled"
              type="button"
              onClick={onCancel}
            >
              {t("Cancel")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangeRole;
