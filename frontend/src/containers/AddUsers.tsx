import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import BackendService from "../services/BackendService";
import UtilsService from "../services/UtilsService";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { UserRoles } from "../models";

interface FormValues {
  emails: string;
  role: string;
}

function AddUsers() {
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm<FormValues>();
  const [role, setRole] = useState("");

  const onSubmit = async (values: FormValues) => {
    const emails = values.emails.split(",").map((email) => email.trim());
    await BackendService.addUsers(values.role, emails);

    history.push("/admin/users", {
      alert: {
        type: "success",
        message: `${emails.length} new user${
          emails.length === 1 ? " has" : "s have"
        } been added as ${values.role} and will receive an invitation email`,
      },
    });
  };

  const onCancel = () => {
    history.push("/admin/users");
  };

  const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
    setRole((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: "Manage users",
            url: "/admin/users",
          },
          {
            label: "Add users",
          },
        ]}
      />

      <h1>Add users</h1>
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
              label="User email address(es)"
              hint="Enter one or more user email addresses separated by a comma (,)"
              multiline
              rows={5}
              register={register}
              error={
                errors.emails &&
                (errors.emails.type === "validate"
                  ? "One or more email addresses is invalid."
                  : "Please add an user email address.")
              }
              required
              validate={UtilsService.validateEmails}
            />

            <label className="usa-label text-bold">Role</label>
            <div className="usa-hint">Select a role for these users</div>
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
                      ref={register()}
                      disabled
                    />
                    <label className="usa-radio__label" htmlFor="editor">
                      {UserRoles.Editor}
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Upcoming feature. Can create and revise draft dashboards.
                    </div>
                  </div>
                </div>
              </div>
              {/*<div className="usa-radio">
                <div
                  className={`grid-row hover:bg-base-lightest hover:border-base flex-column border-base${
                    role === UserRoles.Publisher
                      ? " bg-base-lightest"
                      : "-lighter"
                  } border-2px padding-2 margin-y-1`}
                >
                  <div className="grid-col flex-5">
                    <input
                      className="usa-radio__input"
                      id="publisher"
                      value="publisher"
                      type="radio"
                      name="role"
                      ref={register()}
                    />
                    <label className="usa-radio__label" htmlFor="publisher">
                      {UserRoles.Publisher}
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Have the same permissions as Editors, but can also publish
                      and unpublish/archive dashboards.
                    </div>
                  </div>
                </div>
                </div>*/}
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
                      {UserRoles.Admin}
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Have the same permissions as Publishers but have access to
                      all dashboards. Also manage users and the context of the
                      external homepage.
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <br />
            <hr />
            <Button disabled={!role} type="submit">
              Add user(s) and send invite
            </Button>
            <Button
              className="margin-left-1 text-base-dark hover:text-base-darker active:text-base-darkest"
              variant="unstyled"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddUsers;
