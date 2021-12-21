import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import CardGroup from "../components/CardGroup";
import { usePublicSettings } from "../hooks";
import Link from "../components/Link";

const { Card, CardFooter, CardBody } = CardGroup;

function AccessDenied() {
  const { t } = useTranslation();
  const { settings } = usePublicSettings();

  const onRequestAccess = () => {
    window.location.href = "mailto:".concat(
      settings.contactEmailAddress ? settings.contactEmailAddress : ""
    );
  };

  const onViewPublicWebsite = () => {
    const win = window.open("/", "_blank");
    if (!!win) {
      win.focus();
    }
  };

  return (
    <div className="usa-prose">
      <div className="grid-row">
        <div className="grid-col-12 tablet:grid-col-8">
          <h1 className="font-sans-3xl">{t("WelcomeToPDoA")}</h1>
        </div>
      </div>
      <div className="grid-row">
        <CardGroup>
          <Card title={t("AccessDeniedScreen.CardTitle")} col={7}>
            <CardBody>
              <p>
                {t("AccessDeniedScreen.Message")}
                <br />
                <br />
              </p>
            </CardBody>
            <CardFooter>
              <Button type="button" variant="base" onClick={onRequestAccess}>
                {t("AccessDeniedScreen.RequestAccessButton")}
              </Button>
            </CardFooter>
          </Card>
        </CardGroup>
      </div>
      <hr />
      <div className="grid-row text-center">
        <div className="grid-col">
          <p className="font-sans-md">
            {t("PDoASite")} <br /> {t("WantToViewPublishedSite")}
          </p>
          <Link
            target="_blank"
            to="/"
            external
            ariaLabel={`${t("ViewPublishedSite")} ${t("ARIA.OpenInNewTab")}`}
          >
            {t("ViewPublishedSite")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
