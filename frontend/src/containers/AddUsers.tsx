/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

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
import RadioButtonsTile from "../components/RadioButtonsTile";

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
                        ? `${emails.length} ${t("AddUserNewInvite.Singular")} ${t(values.role)} ${t(
                              "AddUserNewInvite.Final",
                          )}`
                        : `${emails.length} ${t("AddUserNewInvite.Plural")} ${t(values.role)} ${t(
                              "AddUserNewInvite.Final",
                          )}`,
            },
        });
    };

    const onCancel = () => {
        history.push("/admin/users");
    };

    const handleChange = (event: React.FormEvent<HTMLFieldSetElement>) => {
        setRole((event.target as HTMLInputElement).value);
    };

    const roleOptions = [
        {
            id: "editor",
            value: UserRoles.Editor,
            name: "role",
            dataTestId: "editorRadioButton",
            label: t(UserRoles.Editor),
            description: t("AddUsersEditor"),
        },
        {
            id: "admin",
            value: UserRoles.Admin,
            name: "role",
            dataTestId: "adminRadioButton",
            label: t(UserRoles.Admin),
            description: t("AddUsersAdmin"),
        },
    ];

    if (window.EnvironmentConfig?.authenticationRequired) {
        roleOptions.push({
            id: "public",
            value: UserRoles.Public,
            name: "role",
            dataTestId: "publicRadioButton",
            label: t("PublicRole"),
            description: t("AddUsersPublic"),
        });
    }

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

            <h1 id="addUsersLabel">{t("AddUsers")}</h1>
            <div className="grid-row">
                <div className="grid-col-12">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="usa-form usa-form--large"
                        data-testid="AddUsersForm"
                        aria-labelledby="addUsersLabel"
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

                        <label className="usa-label text-bold">{t("UserListingRole")}</label>

                        <fieldset className="usa-fieldset" onChange={handleChange}>
                            <legend className="usa-hint">{t("AddUsersRoleSelect")}</legend>
                            <RadioButtonsTile
                                isHorizontally={false}
                                register={register}
                                options={roleOptions}
                            />
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
