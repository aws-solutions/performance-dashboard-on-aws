/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface SpinnerProps {
  label: string;
  className?: string;
  style?: any;
}

function Spinner(props: SpinnerProps) {
  return (
    <div className={props.className} style={props.style} aria-hidden="true">
      <FontAwesomeIcon icon={faSpinner} spin pulse size="lg" />
      <span className="margin-left-1">{props.label}</span>
    </div>
  );
}

export default Spinner;
