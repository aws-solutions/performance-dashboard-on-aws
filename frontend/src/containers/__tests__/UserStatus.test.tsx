/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FormattingCSV from "../UserStatus";

jest.mock("../../hooks");

beforeEach(() => {
    render(<FormattingCSV />, { wrapper: MemoryRouter });
});

test("renders the page title", async () => {
    const title = screen.getByRole("heading", { name: "User Statuses" });
    expect(title).toBeInTheDocument();
});

test("renders the page description", async () => {
    expect(
        screen.getByText(
            "Users in the system have different statuses. These statuses are being pulled directly from AWS Cognito but we explain what they mean below.",
        ),
    ).toBeInTheDocument();
});

test("renders the unconfirmed header", async () => {
    const title = screen.getByRole("heading", { name: "UNCONFIRMED" });
    expect(title).toBeInTheDocument();
});

test("renders the unconfirmed section description", async () => {
    expect(
        screen.getByText(
            "This user has been created but not confirmed. They have not logged into the dashboard system. Check that you have the correct email and you can resend the invite email.",
        ),
    ).toBeInTheDocument();
});

test("renders the confirmed header", async () => {
    const title = screen.getByRole("heading", { name: "CONFIRMED" });
    expect(title).toBeInTheDocument();
});

test("renders the confirmed section description", async () => {
    expect(
        screen.getByText(
            "This user has been confirmed and they have successfully logged in to the system.",
        ),
    ).toBeInTheDocument();
});

test("renders the archived header", async () => {
    const title = screen.getByRole("heading", { name: "ARCHIVED" });
    expect(title).toBeInTheDocument();
});

test("renders the archived section descripton", async () => {
    expect(screen.getByText("User is no longer active in the system.")).toBeInTheDocument();
});

test("renders the compromised header", async () => {
    const title = screen.getByRole("heading", { name: "COMPROMISED" });
    expect(title).toBeInTheDocument();
});

test("renders the compromised section description", async () => {
    expect(
        screen.getByText("This user has been disabled due to a potential security threat."),
    ).toBeInTheDocument();
});

test("renders the unknown header", async () => {
    const title = screen.getByRole("heading", { name: "UNKNOWN" });
    expect(title).toBeInTheDocument();
});

test("renders the unknown section description", async () => {
    expect(screen.getByText("This user status is not known.")).toBeInTheDocument();
});

test("renders the reset required header", async () => {
    const title = screen.getByRole("heading", { name: "RESET_REQUIRED" });
    expect(title).toBeInTheDocument();
});

test("renders the reset required description", async () => {
    expect(
        screen.getByText(
            "This user is confirmed, but when the user navigates to the system they must request a code and reset their password before they can sign in.",
        ),
    ).toBeInTheDocument();
});

test("renders the force change password header", async () => {
    const title = screen.getByRole("heading", {
        name: "FORCE_CHANGE_PASSWORD",
    });
    expect(title).toBeInTheDocument();
});

test("renders the force change password section description", async () => {
    expect(
        screen.getByText(
            "The user is confirmed and the user can sign in using a temporary password, but during their first sign-in, the user must change their password to a new value before doing anything else.",
        ),
    ).toBeInTheDocument();
});
