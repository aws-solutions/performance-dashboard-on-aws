import React from "react";
import { useTranslation } from "react-i18next";

function UserStatus() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("UserStatuses.UserStatusesH1")}</h1>
      <div className="font-sans-lg usa-prose">
        <p>
          {t("UserStatuses.UserStatusesDesc")}{" "}
          <a
            href="https://aws.amazon.com/cognito/"
            target="_blank"
            rel="noreferrer"
          >
            {t("UserStatuses.LearnCognitoDesc")}
          </a>
        </p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Unconfirmed")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.UnconfirmedDesc")}</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Confirmed")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.ConfirmedDesc")}</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Archived")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.ArchivedDesc")}</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Compromised")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.CompromisedDesc")}</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Unknown")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.UnknownDesc")}</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Reset_Required")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.Reset_RequiredDesc")}</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">
        {t("UserStatuses.Force_Change_Password")}
      </h3>
      <div className="usa-prose">
        <p>{t("UserStatuses.Force_Change_PasswordDesc")}</p>
      </div>
    </>
  );
}

export default UserStatus;
