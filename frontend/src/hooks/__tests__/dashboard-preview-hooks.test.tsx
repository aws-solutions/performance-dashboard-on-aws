/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import { useFullPreview } from "../dashboard-preview-hooks";

describe("useFullPreview", () => {
  interface Props {
    previewPanelId: string;
  }
  const FooComponent = (props: Props) => {
    const { fullPreviewButton } = useFullPreview(props.previewPanelId);
    return <>{fullPreviewButton}</>;
  };
  test("should toggle full preview", async () => {
    const { getByRole } = render(<FooComponent previewPanelId="panel-id" />);

    const expandPreviewButton = getByRole("button", {
      name: "Full screen preview",
    });
    expect(expandPreviewButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(expandPreviewButton);
    });

    const closePreviewButton = getByRole("button", {
      name: "Exit full screen preview",
    });
    expect(closePreviewButton).toBeInTheDocument();
  });
});
