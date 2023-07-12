/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, fireEvent, act, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Router } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import AddChart from "../AddChart";
import { createMemoryHistory } from "history";
import ParsingFileService from "../../services/ParsingFileService";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../services/ParsingFileService");
jest.mock("../../hooks");

beforeEach(() => {
    BackendService.createWidget = jest.fn();
    BackendService.createDataset = jest.fn().mockReturnValue({ id: "1244" });
    StorageService.uploadDataset = jest.fn().mockReturnValue({
        s3Keys: {
            raw: "abc.csv",
            json: "abc.json",
        },
    });
});

test("renders title and subtitles", async () => {
    render(<AddChart />, {
        wrapper: MemoryRouter,
    });
    expect(
        await screen.findByRole("heading", { name: "Add chart - choose data" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Data")).toBeInTheDocument();
    expect(
        await screen.findByText(
            "Choose an existing dataset or create a new one to populate this chart.",
        ),
    ).toBeInTheDocument();
});

test("renders a file upload input", async () => {
    render(<AddChart />, { wrapper: MemoryRouter });

    const radioButton = screen.getByTestId("staticDatasetRadioButton");
    fireEvent.click(radioButton);

    expect(await screen.findByLabelText("Static datasets")).toBeInTheDocument();
});

test("renders table for dynamic dataset", async () => {
    render(<AddChart />, { wrapper: MemoryRouter });

    const radioButton = screen.getByTestId("dynamicDatasetRadioButton");
    await act(async () => {
        fireEvent.click(radioButton);
    });

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("abc")).toBeInTheDocument();
});

test("on submit, it calls createWidget api and uploads dataset", async () => {
    ParsingFileService.parseFile = jest
        .fn()
        .mockImplementation((_data: File, _header: boolean, onParse: Function) =>
            onParse(null, [["country", "grade"]]),
        );

    const { getByRole, getByText, getByLabelText, getAllByText, getByTestId } = render(
        <AddChart />,
        {
            wrapper: MemoryRouter,
        },
    );

    let continueButton = getByRole("button", { name: "Continue" });

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

    await waitFor(() => {
        expect(
            getByText(
                "Please make sure that the system formats your data correctly." +
                    " Select columns to format as numbers, dates, or text. Also select" +
                    " columns to hide or show from the chart.",
            ),
        ).toBeInTheDocument();
    });

    await waitFor(() => {
        continueButton = getByRole("button", { name: "Continue" });
        fireEvent.click(continueButton);
    });

    fireEvent.input(getByLabelText("Chart title"), {
        target: {
            value: "COVID Cases",
        },
    });

    const submitButton = getByRole("button", { name: "Add chart" });

    await waitFor(() => {
        expect(ParsingFileService.parseFile).toHaveBeenCalled();
    });

    await waitFor(() => expect(submitButton).toBeEnabled());
    await act(async () => {
        fireEvent.click(submitButton);
    });

    expect(BackendService.createWidget).toHaveBeenCalled();
    expect(StorageService.uploadDataset).toHaveBeenCalled();
    expect(BackendService.createDataset).toHaveBeenCalled();
});

test("cancel link takes you to Edit Dashboard screen", async () => {
    const history = createMemoryHistory();
    jest.spyOn(history, "push");

    const { findByRole } = render(
        <Router history={history}>
            <AddChart />
        </Router>,
    );

    await act(async () => {
        const cancelButton = await findByRole("button", { name: "Cancel" });
        fireEvent.click(cancelButton);
    });

    expect(history.push).toHaveBeenCalledWith("/admin/dashboard/edit/undefined");
});

test("on wrong CSV, it should display the proper error message", async () => {
    ParsingFileService.parseFile = jest
        .fn()
        .mockImplementation((_data: File, _header: boolean, onParse: Function) =>
            onParse(null, [{ "": "hello" }]),
        );

    const { getByRole, getByText, getByLabelText, getByTestId } = render(<AddChart />, {
        wrapper: MemoryRouter,
    });

    let continueButton = getByRole("button", { name: "Continue" });

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

    await waitFor(() => {
        expect(ParsingFileService.parseFile).toHaveBeenCalled();
        expect(
            getByText(
                "Failed to upload file. Please make sure there are values for all column headers.",
            ),
        ).toBeInTheDocument();
    });
});

test("when the file parsing errors, it should display the proper error message", async () => {
    ParsingFileService.parseFile = jest
        .fn()
        .mockImplementation((_data: File, _header: boolean, onParse: Function) =>
            onParse([{ message: "Parsing errors found." }], null),
        );

    const { getByRole, getByText, getByLabelText, getByTestId } = render(<AddChart />, {
        wrapper: MemoryRouter,
    });

    let continueButton = getByRole("button", { name: "Continue" });

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

    await waitFor(() => {
        expect(ParsingFileService.parseFile).toHaveBeenCalled();
        expect(getByText("Parsing errors found.")).toBeInTheDocument();
    });
});
