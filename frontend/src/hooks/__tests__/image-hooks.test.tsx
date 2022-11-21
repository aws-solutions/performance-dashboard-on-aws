/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useImage } from "../image-hooks";
import StorageService from "../../services/StorageService";

describe("useImage", () => {
  interface Props {
    s3Key: string;
  }
  const FooComponent = (props: Props) => {
    const { file } = useImage(props.s3Key);
    return (
      <>
        <span>{file?.name}</span>
      </>
    );
  };

  test("should fetch the image", async () => {
    const sampleImage: File = { name: "image.jpg" } as File;
    const downloadFileSpy = jest
      .spyOn(StorageService, "downloadFile")
      .mockReturnValue(Promise.resolve(sampleImage));

    await act(async () => {
      render(<FooComponent s3Key="/image.jpg" />);
    });

    expect(downloadFileSpy).toHaveBeenCalled();
    expect(screen.getByText(sampleImage.name)).toBeInTheDocument();
  });
});
