/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import EditDateFormat from "../EditDateFormat";

jest.mock("../../hooks");
jest.mock("../../services/BackendService");

beforeEach(async () => {
    BackendService.updateSetting = jest.fn().mockReturnValue({ id: "123" });
    await act(async () => {
        render(<EditDateFormat />, { wrapper: MemoryRouter });
    });
});

test("submits form with date and time format values", async () => {
    fireEvent.change(screen.getByLabelText("Date format*"), {
        target: {
            value: "YYYY-MM-DD",
        },
    });

    fireEvent.change(screen.getByLabelText("Time format*"), {
        target: {
            value: "h:mm A",
        },
    });

    await act(async () => {
        fireEvent.submit(
            screen.getByRole("button", {
                name: "Save",
            }),
        );
    });

    expect(BackendService.updateSetting).toBeCalledWith(
        "dateTimeFormat",
        {
            date: "YYYY-MM-DD",
            time: "h:mm A",
        },
        expect.anything(),
    );
});
