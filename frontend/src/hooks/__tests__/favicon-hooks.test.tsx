/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useFavicon } from "../favicon-hooks";
import StorageService from "../../services/StorageService";

describe("useFavicon", () => {
  interface Props {
    s3Key: string;
  }
  const FooComponent = (props: Props) => {
    const { faviconFileName } = useFavicon(props.s3Key);
    return (
      <>
        <span>{faviconFileName}</span>
      </>
    );
  };

  test("should fetch the favicon", async () => {
    const sampleFavicon: File = { name: "favicon.ico" } as File;
    const downloadFaviconSpy = jest
      .spyOn(StorageService, "downloadFavicon")
      .mockReturnValue(Promise.resolve(sampleFavicon));

    await act(async () => {
      render(<FooComponent s3Key="/favicon.ico" />);
    });

    expect(downloadFaviconSpy).toHaveBeenCalled();
    expect(screen.getByText(sampleFavicon.name)).toBeInTheDocument();
  });
});
