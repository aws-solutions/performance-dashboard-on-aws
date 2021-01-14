import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import BackendService from "../services/BackendService";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import { LocationState, UserRoles } from "../models";

interface FormValues {
  emails: string;
  role: string;
}

function ChangeRole() {
  const history = useHistory<LocationState>();
  const { state } = history.location;
  const { register, handleSubmit } = useForm<FormValues>();
  const [role, setRole] = useState("");

  const onSubmit = async (values: FormValues) => {
    const emails = values.emails.split(",").map((email) => email.trim());
    await BackendService.changeRole(values.role, emails);

    history.push("/admin/users", {
      alert: {
        type: "success",
        message: `${emails.length} user${
          emails.length === 1 ? " has" : "s have"
        } changed the role to ${values.role}`,
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
            label: "Manage users",
            url: "/admin/users",
          },
          {
            label: "Change role",
          },
        ]}
      />

      <h1>Change role</h1>
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
              label="User email address(es)"
              multiline
              rows={5}
              defaultValue={state.emails}
              register={register}
              disabled
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
                    />
                    <label className="usa-radio__label" htmlFor="editor">
                      {UserRoles.Editor}
                    </label>
                  </div>
                  <div className="grid-col flex-7">
                    <div className="usa-prose text-base margin-left-4">
                      Can create and revise draft dashboards.
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
              Save
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

export default ChangeRole;
