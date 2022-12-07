/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import AddUsers from "../AddUsers";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

const history = createMemoryHistory();

describe("AddUsersForm", () => {
    beforeEach(async () => {
        // Mocks
        jest.spyOn(history, "push");
        BackendService.createDashboard = jest.fn();

        render(
            <Router history={history}>
                <AddUsers />
            </Router>,
        );
    });

    test("submits form with the entered values", async () => {
        fireEvent.input(screen.getByLabelText("User email address(es)*"), {
            target: {
                value: "test@example.com",
            },
        });

        fireEvent.input(screen.getByTestId("editorRadioButton"), {
            target: {
                checked: true,
            },
        });

        await act(async () => {
            fireEvent.submit(screen.getByTestId("AddUsersForm"));
        });

        expect(BackendService.addUsers).toBeCalledWith("Editor", ["test@example.com"]);
    });

    test("invokes cancel function when use clicks cancel", async () => {
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        });
        expect(history.push).toHaveBeenCalledWith("/admin/users");
    });
});
