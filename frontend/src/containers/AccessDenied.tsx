import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import CardGroup from "../components/CardGroup";
import Link from "../components/Link";

const { Card, CardFooter, CardBody } = CardGroup;

function AccessDenied() {
  const { t } = useTranslation();

  const onRequestAccess = () => {
    window.location.href = "/public/contact";
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
          <Card
            id="access-denied"
            title={t("AccessDeniedScreen.CardTitle")}
            col={7}
          >
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
