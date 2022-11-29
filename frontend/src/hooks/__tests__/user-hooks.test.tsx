/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen, within } from "@testing-library/react";
import { useCurrentAuthenticatedUser, useUsers } from "../user-hooks";
import BackendService from "../../services/BackendService";
import { Auth } from "@aws-amplify/auth";

describe("useCurrentAuthenticatedUser", () => {
  const FooComponent = () => {
    const { username, isFederatedId, hasRole } = useCurrentAuthenticatedUser();
    return (
      <>
        <span data-testid="username">{username}</span>
        <span data-testid="isFederatedId">{`${isFederatedId}`}</span>
        <span data-testid="hasRole">{`${hasRole}`}</span>
      </>
    );
  };

  test("should fetch the authenticated user", async () => {
    const sampleUser: any = {
      username: "cognito user",
      attributes: {
        identities: '[{ "providerType": "Federated" }]',
        "custom:roles": "Admin",
      },
    };
    const currentAuthenticatedUserSpy = jest
      .spyOn(Auth, "currentAuthenticatedUser")
      .mockImplementation(() => Promise.resolve(sampleUser));

    await act(async () => {
      render(<FooComponent />);
    });

    expect(currentAuthenticatedUserSpy).toHaveBeenCalled();
    expect(
      within(screen.getByTestId("username")).getByText(sampleUser.username)
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("isFederatedId")).getByText("true")
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("hasRole")).getByText("true")
    ).toBeInTheDocument();
  });
});

describe("useUsers", () => {
  const FooComponent = () => {
    const { users } = useUsers();
    return (
      <>
        <span>{users?.length}</span>
      </>
    );
  };

  test("should fetch the users", async () => {
    const fetchUsersSpy = jest
      .spyOn(BackendService, "fetchUsers")
      .mockImplementation(() => Promise.resolve([]));

    await act(async () => {
      render(<FooComponent />);
    });

    expect(fetchUsersSpy).toHaveBeenCalled();
    expect(screen.getByText(0)).toBeInTheDocument();
  });
});
