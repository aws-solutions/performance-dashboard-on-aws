/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useSettings, usePublicSettings } from "../settings-hooks";
import SettingsProvider from "../../context/SettingsProvider";

describe("useSettings", () => {
  interface Props {
    refetch?: boolean;
  }
  const FooComponent = (props: Props) => {
    const { settings } = useSettings(props.refetch);
    return (
      <SettingsProvider>
        <span>{settings?.contactUsContent}</span>
      </SettingsProvider>
    );
  };

  test("should reload the settings", async () => {
    const modifiedSettings: any = { contactUsContent: "contact us" };
    const mockReloadSettings = jest.fn();
    const mockUseContext = jest.fn().mockImplementation(() => ({
      reloadSettings: mockReloadSettings,
      settings: modifiedSettings,
    }));
    React.useContext = mockUseContext;
    await act(async () => {
      render(<FooComponent refetch={true} />);
    });

    expect(mockReloadSettings).toHaveBeenCalled();
    expect(
      screen.getByText(modifiedSettings.contactUsContent)
    ).toBeInTheDocument();
  });
});

describe("usePublicSettings", () => {
  interface Props {
    refetch?: boolean;
  }
  const FooComponent = (props: Props) => {
    const { settings } = usePublicSettings(props.refetch);
    return (
      <SettingsProvider>
        <span>{settings?.contactUsContent}</span>
      </SettingsProvider>
    );
  };

  test("should reload the settings", async () => {
    const modifiedSettings: any = { contactUsContent: "contact us" };
    const mockReloadSettings = jest.fn();
    const mockUseContext = jest.fn().mockImplementation(() => ({
      reloadSettings: mockReloadSettings,
      settings: modifiedSettings,
    }));
    React.useContext = mockUseContext;
    await act(async () => {
      render(<FooComponent refetch={true} />);
    });

    expect(mockReloadSettings).toHaveBeenCalled();
    expect(
      screen.getByText(modifiedSettings.contactUsContent)
    ).toBeInTheDocument();
  });
});
