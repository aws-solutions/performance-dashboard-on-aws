/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useTranslation } from "react-i18next";

const ColorsHelpPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="font-sans-2xl">{t("ColorAndAccessibility.Label")}</h1>
      <div className="usa-prose">
        <p>{t("ColorAndAccessibility.Description")}</p>
      </div>
      <h2>{t("ColorAndAccessibility.ColorFormat")}</h2>
      <div className="usa-prose">
        <p>{t("ColorAndAccessibility.ColorFormatDescription")}</p>
      </div>
      <h2>{t("ColorAndAccessibility.Contrast")}</h2>
      <div className="usa-prose">
        <p>{t("ColorAndAccessibility.ContrastDescription1")}</p>
        <ul>
          <li>{t("ColorAndAccessibility.ContrastDescription2")}</li>
          <li>{t("ColorAndAccessibility.ContrastDescription3")}</li>
          <li>{t("ColorAndAccessibility.ContrastDescription4")}</li>
        </ul>
        <p>{t("ColorAndAccessibility.ContrastDescription5")}</p>
        <p>{t("ColorAndAccessibility.ContrastDescription6")}</p>
      </div>
    </>
  );
};

export default ColorsHelpPage;
