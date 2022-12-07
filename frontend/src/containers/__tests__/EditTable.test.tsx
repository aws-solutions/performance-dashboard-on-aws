/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditTable from "../EditTable";
import { createMemoryHistory } from "history";
import papaparse from "papaparse";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("papaparse");
jest.mock("../../hooks");

beforeEach(() => {
    BackendService.editWidget = jest.fn();
    BackendService.createDataset = jest.fn().mockReturnValue({ id: "1244" });
    StorageService.uploadDataset = jest.fn().mockReturnValue({
        s3Keys: {
            raw: "abc.csv",
            json: "abc.json",
        },
    });
    StorageService.downloadFile = jest.fn();
});

test("renders title", async () => {
    render(<EditTable />, { wrapper: MemoryRouter });
    expect(await screen.findByRole("heading", { name: "Edit table" })).toBeInTheDocument();
});

test("renders a textfield for table title", async () => {
    render(<EditTable />, { wrapper: MemoryRouter });
    expect(await screen.findByLabelText("Table title*")).toBeInTheDocument();
});

test("renders a choose data button", async () => {
    render(<EditTable />, { wrapper: MemoryRouter });
    expect(await screen.findByRole("tab", { name: "Choose data" })).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
    const parseSpy = jest.spyOn(papaparse, "parse");
    const { getByRole, getAllByText, getByLabelText, getByTestId } = render(<EditTable />, {
        wrapper: MemoryRouter,
    });

    await act(async () => {
        fireEvent.click(getByRole("tab", { name: "Choose data" }));
    });

    const continueButton = getByRole("button", { name: "Continue" });
    const radioButton = getByTestId("staticDatasetRadioButton");

    await waitFor(() => {
        continueButton.removeAttribute("disabled");
        fireEvent.click(radioButton);
    });

    const file = new File(["dummy content"], "test.csv", {
        type: "text/csv",
    });
    const uploadFile = getByLabelText("Static datasets");
    Object.defineProperty(uploadFile, "files", { value: [file] });
    Object.defineProperty(uploadFile, "value", {
        value: file.name,
    });
    fireEvent.change(uploadFile);

    await act(async () => {
        fireEvent.click(continueButton);
    });

    fireEvent.input(getByLabelText("Table title*"), {
        target: {
            value: "COVID Cases",
        },
    });

    const submitButton = getAllByText("Save")[0];

    await waitFor(() => {
        expect(parseSpy).toHaveBeenCalled();
        submitButton.removeAttribute("disabled");
    });

    await waitFor(() => expect(submitButton).toBeEnabled());
    await act(async () => {
        fireEvent.click(submitButton);
    });

    expect(BackendService.editWidget).toHaveBeenCalled();
    expect(StorageService.uploadDataset).toHaveBeenCalled();
    expect(BackendService.createDataset).toHaveBeenCalled();
});

test("cancel link takes you to Edit Dashboard screen", async () => {
    const history = createMemoryHistory();
    jest.spyOn(history, "push");

    const { findByRole } = render(
        <Router history={history}>
            <EditTable />
        </Router>,
    );

    await act(async () => {
        const cancelButton = await findByRole("button", { name: "Cancel" });
        fireEvent.click(cancelButton);
    });

    expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});
