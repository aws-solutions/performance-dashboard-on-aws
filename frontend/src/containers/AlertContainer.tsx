/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useHistory } from "react-router-dom";
import { LocationState } from "../models";
import Alert from "../components/Alert";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";

interface Props {
  id?: string;
}

function AlertContainer(props: Props) {
  const history = useHistory<LocationState>();
  const { t } = useTranslation();
  const { state } = history.location;

  if (!state || !state.alert || state.id !== props.id) {
    return null;
  }

  return (
    <div className="margin-bottom-2 margin-top-1">
      <Alert
        type={state.alert.type}
        message={
          state.alert.linkLabel && state.alert.to ? (
            <div className="margin-left-6">
              {state.alert.message}{" "}
              <Link
                target="_blank"
                to={state.alert.to}
                ariaLabel={`${state.alert.linkLabel} ${t("ARIA.OpenInNewTab")}`}
                external
              >
                {state.alert.linkLabel}
              </Link>
            </div>
          ) : (
            state.alert.message
          )
        }
        slim
      />
    </div>
  );
}

export default AlertContainer;
