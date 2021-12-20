import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { useCurrentAuthenticatedUser } from "../hooks";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import CardGroup from "../components/CardGroup";

const { Card, CardFooter, CardBody } = CardGroup;

function AdminHome() {
  const history = useHistory();
  const currentAuthenticatedUser = useCurrentAuthenticatedUser();
  const { t } = useTranslation();

  const onCreateDashboard = () => {
    history.push("/admin/dashboard/create");
  };

  const onViewDashboards = () => {
    history.push("/admin/dashboards");
  };

  const onManageUsers = () => {
    history.push("/admin/users");
  };

  const onViewSettings = () => {
    history.push("/admin/settings");
  };

  if (
    !currentAuthenticatedUser ||
    (!currentAuthenticatedUser.isEditor && !currentAuthenticatedUser.isAdmin)
  ) {
    return null;
  }

  return (
    <div className="usa-prose">
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl line-height-sans-2 margin-top-2">
            {t("WelcomeToPDoA")}
          </h1>
          <p className="font-sans-lg usa-prose">
            {`${
              currentAuthenticatedUser.isAdmin
                ? `${t("WhatYouCanDoAsAdmin")}`
                : `${t("WhatYouCanDoAsNotAdmin")}`
            }`}
          </p>
        </div>
      </div>
      <div className="grid-row margin-top-2">
        {currentAuthenticatedUser.isEditor ? (
          <CardGroup>
            <Card title={t("CreateANewDashboard")} col={7}>
              <CardBody>
                <p>
                  {t("BuildDraftDashboards")}
                  <br />
                  <br />
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="base"
                  onClick={onCreateDashboard}
                >
                  {t("CreateDashboard")}
                </Button>
              </CardFooter>
            </Card>
            <Card title={t("ViewExistingDashboards")} col={5}>
              <CardBody>
                <p>{t("ViewDashboardsCreatedByOthers")}</p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onViewDashboards}
                >
                  {t("ViewDashboard")}
                </Button>
              </CardFooter>
            </Card>
          </CardGroup>
        ) : (
          ""
        )}
        {currentAuthenticatedUser.isAdmin ? (
          <CardGroup>
            <Card title={t("CreateANewDashboard")} col={4}>
              <CardBody>
                <p>
                  {t("BuildDraftDashboards")}
                  <br />
                  <br />
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="base"
                  onClick={onCreateDashboard}
                >
                  {t("CreateDashboard")}
                </Button>
              </CardFooter>
            </Card>
            <Card title={t("AddOtherUsers")} col={4}>
              <CardBody>
                <p>{t("AllowOtherUsers")}</p>
              </CardBody>
              <CardFooter>
                <Button type="button" variant="outline" onClick={onManageUsers}>
                  {t("ManageUsers")}
                </Button>
              </CardFooter>
            </Card>
            <Card title={t("CustomizeSettings")} col={4}>
              <CardBody>
                <p>{t("PersonalizeDashboard")}</p>
              </CardBody>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onViewSettings}
                >
                  {t("ViewSettings")}
                </Button>
              </CardFooter>
            </Card>
          </CardGroup>
        ) : (
          ""
        )}
      </div>
      <hr />
      <div className="grid-row text-center">
        <div className="grid-col">
          <p className="font-sans-md">
            {t("PDoASite")} <br /> {t("WantToViewPublishedSite")}
          </p>
          <a
            href="/"
            target="_blank"
            title="(opens in a new tab)"
            className="usa-link"
          >
            {t("ViewPublishedSite")}
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="margin-left-05"
              size="xs"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
