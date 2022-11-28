/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode;
  className?: string;
}

function Header(props: Props) {
  const { t } = useTranslation();

  return (
    <header
      role="contentinfo"
      aria-label={t("ARIA.Header")}
      className={`border-base-lighter border-width-1px shadow-2 z-top position-sticky top-0 bg-white ${props.className}`}
    >
      {props.children}
    </header>
  );
}

export default Header;
