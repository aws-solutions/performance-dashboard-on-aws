/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditMetrics from "../EditMetrics";
import { act } from "react-dom/test-utils";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");

beforeEach(() => {
    BackendService.editWidget = jest.fn();
    BackendService.createDataset = jest.fn().mockReturnValue({ id: "123" });
    StorageService.uploadMetric = jest.fn().mockReturnValue({
        s3Keys: {
            raw: "abc.json",
            json: "abc.json",
        },
    });
    StorageService.downloadJson = jest.fn();
});

test("renders title", async () => {
    render(<EditMetrics />, { wrapper: MemoryRouter });
    expect(await screen.findByRole("heading", { name: "Edit metrics" })).toBeInTheDocument();
});

test("renders a textfield for metric title", async () => {
    render(<EditMetrics />, { wrapper: MemoryRouter });
    expect(await screen.findByLabelText("Metrics title")).toBeInTheDocument();
});

test("on submit, it does not calls editWidget api and uploads dataset without a metric added", async () => {
    const { getByRole, getByLabelText } = render(<EditMetrics />, {
        wrapper: MemoryRouter,
    });

    const submitButton = getByRole("button", { name: "Save" });

    fireEvent.input(getByLabelText("Metrics title"), {
        target: {
            value: "Test Metrics",
        },
    });

    await waitFor(() => expect(submitButton).toBeEnabled());
    await act(async () => {
        fireEvent.click(submitButton);
    });

    expect(BackendService.editWidget).not.toHaveBeenCalled();
    expect(StorageService.uploadMetric).not.toHaveBeenCalled();
});
