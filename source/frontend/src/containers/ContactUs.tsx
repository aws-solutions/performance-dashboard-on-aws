import React from "react";
import MarkdownRender from "../components/MarkdownRender";
import { usePublicSettings } from "../hooks";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../components/Breadcrumbs";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "../components/Spinner";

function ContactUs() {
  const { t } = useTranslation();
  const { settings, loadingSettings } = usePublicSettings(true);

  return (
    <>
      <Breadcrumbs
        crumbs={[
          {
            label: t("Home"),
            url: "/",
          },
          {
            label: t("ContactUs"),
          },
        ]}
      />

      <h1 id="contactUsLabel">{t("ContactUs")}</h1>

      {loadingSettings ? (
        <Spinner
          className="text-center margin-top-9"
          label={t("LoadingSpinnerLabel")}
        />
      ) : (
        <div>
          <MarkdownRender
            source={settings.contactUsContent}
            className="margin-bottom-2"
          />

          <div className="grid-row">
            <div className="grid-col flex-9">
              <div className="published-site font-sans-lg">
                {settings.contactEmailAddress && (
                  <div>
                    {settings.contactEmailAddress}
                    <a
                      title={t("ContactUs")}
                      aria-label={t("ContactUs")}
                      href={`mailto:${settings.contactEmailAddress}?subject=${t(
                        "Public.PerformanceDashboardAssistance"
                      )}`}
                      className="usa-link margin-left-1"
                    >
                      <FontAwesomeIcon
                        size="1x"
                        icon={faEnvelope}
                        className="margin-right-1"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="grid-col flex-3 text-right"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactUs;
