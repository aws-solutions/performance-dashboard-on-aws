/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from "react";
import { useWindowSize } from "../hooks";

interface Props {
  children: ReactNode;
  className?: string;
  //Distance from the top of the page (in pixels) that this element will stick at
  stickyPosition?: number;
}

function PrimaryActionBar(props: Props) {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

  return (
    <div
      className={`border-base-lighter border-1px shadow-3 z-500 radius-md padding-2 bg-white ${
        isMobile ? "" : "position-sticky "
      }${props.className || ""}`}
      style={isMobile ? { marginTop: "1rem" } : { top: props.stickyPosition }}
    >
      {props.children}
    </div>
  );
}

export default PrimaryActionBar;
