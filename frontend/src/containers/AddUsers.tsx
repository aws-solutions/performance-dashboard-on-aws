import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import BackendService from "../services/BackendService";
import UtilsService from "../services/UtilsService";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { UserRoles } from "../models";
import { useTranslation } from "react-i18next";
import { useChangeBackgroundColor } from "../hooks";

interface FormValues {
  emails: string;
  role: string;
}

function AddUsers() {
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [role, setRole] = useState("");

  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    const emails = values.emails.split(",").map((email) => email.trim());
    await BackendService.addUsers(values.role, emails);

    history.push("/admin/users", {
      alert: {
        type: "success",
        message:
          emails.length === 1
            ? `${emails.length} ${t("AddUserNewInvite.Singular")} ${t(
                values.role
              )} ${t("AddUserNewInvite.Final")}`
            : `${emails.length} ${t("AddUserNewInvite.Plural")} ${t(
                values.role
              )} ${t("AddUserNewInvite.Final")}`,
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/users");
  };

  const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
    setRole((event.target as HTMLInputElement).value);
  };

  useChangeBackgroundColor();

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: t("ManageUsers"),
            url: "/admin/users",
          },
          {
            label: t("AddUsers"),
          },
        ]}
      />

      <h1>{t("AddUsers")}</h1>
      <div className="grid-row">
        <div className="grid-col-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="usa-form usa-form--large"
            data-testid="AddUsersForm"
          >
            <TextField
              id="emails"
              name="emails"
              label={t("AddUsersEmails")}
              hint={t("AddUsersEmailsHint")}
              multiline
              rows={5}
              register={register}
              error={
                errors.emails &&
                (errors.emails.type === "validate"
                  ? t("AddUsersValidate.Invalid")
                  : t("AddUsersValidate.PleaseAdd"))
              }
              required
              validate={UtilsService.validateEmails}
            />

            <label className="usa-label text-bold">
              {t("UserListingRole")}
            </label>
            <div className="usa-hint">{t("AddUsersRoleSelect")}</div>

            <fieldset className="usa-fieldset" onChange={handleChange}>
              <legend className="usa-sr-only">Roles</legend>
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
                      data-testid="editorRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="editor">
                      {UserRoles.Editor}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddUsersEditor")}
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
                      data-testid="adminRadioButton"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="admin">
                      {UserRoles.Admin}
                      <p className="text-base usa-checkbox__label-description">
                        {t("AddUsersAdmin")}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>

            <br />
            <hr />
            <Button disabled={!role} type="submit">
              {t("AddUsersInvites")}
            </Button>
            <Button
              className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
              variant="unstyled"
              type="button"
              onClick={onCancel}
            >
              {t("GlobalCancel")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddUsers;
