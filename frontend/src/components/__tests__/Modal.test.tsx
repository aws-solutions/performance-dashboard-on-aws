/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import Modal from "../Modal";

test("renders a delete type Modal", async () => {
    const { baseElement } = render(
        <Modal
            title={"test title"}
            message={"test message"}
            isOpen={true}
            closeModal={() => {}}
            buttonType="Delete"
            buttonAction={() => {}}
            ariaHideApp={false}
        />,
    );
    expect(baseElement).toMatchSnapshot();
});

test("renders a publish type Modal", async () => {
    const { baseElement } = render(
        <Modal
            title={"test title"}
            message={"test message"}
            isOpen={true}
            closeModal={() => {}}
            buttonType="Prepare for publishing"
            buttonAction={() => {}}
            ariaHideApp={false}
        />,
    );
    expect(baseElement).toMatchSnapshot();
});

test("renders an archive type Modal", async () => {
    const { baseElement } = render(
        <Modal
            title={"test title"}
            message={"test message"}
            isOpen={true}
            closeModal={() => {}}
            buttonType="Archive"
            buttonAction={() => {}}
            ariaHideApp={false}
        />,
    );
    expect(baseElement).toMatchSnapshot();
});

test("renders a create draft type Modal", async () => {
    const { baseElement } = render(
        <Modal
            title={"test title"}
            message={"test message"}
            isOpen={true}
            closeModal={() => {}}
            buttonType="Create draft"
            buttonAction={() => {}}
            ariaHideApp={false}
        />,
    );
    expect(baseElement).toMatchSnapshot();
});

test("renders a re-publish type Modal", async () => {
    const { baseElement } = render(
        <Modal
            title={"test title"}
            message={"test message"}
            isOpen={true}
            closeModal={() => {}}
            buttonType="Re-publish"
            buttonAction={() => {}}
            ariaHideApp={false}
        />,
    );
    expect(baseElement).toMatchSnapshot();
});
