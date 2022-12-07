/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render } from "@testing-library/react";
import CardGroup from "../CardGroup";

const { Card, CardBody, CardFooter } = CardGroup;

test("renders a card group with 1 card", async () => {
    const wrapper = render(
        <CardGroup>
            <Card title="Hello World" col={12}>
                <CardBody>Welcome to Performance Dashboard</CardBody>
                <CardFooter>by AWS</CardFooter>
            </Card>
        </CardGroup>,
    );
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a card group with multiple cards", async () => {
    const wrapper = render(
        <CardGroup>
            <Card title="Hello World" col={4}>
                <CardBody>Welcome to Performance Dashboard</CardBody>
                <CardFooter>by AWS</CardFooter>
            </Card>
            <Card title="Hola Mundo" col={4}>
                <CardBody>Bienvenido a Performance Dashboard</CardBody>
                <CardFooter>by AWS</CardFooter>
            </Card>
            <Card title="Bonjour le monde" col={4}>
                <CardBody>Bienvenue chez Performance Dashboard</CardBody>
                <CardFooter>by AWS</CardFooter>
            </Card>
        </CardGroup>,
    );
    expect(wrapper.container).toMatchSnapshot();
});

test("renders a card without footer", async () => {
    const wrapper = render(
        <CardGroup>
            <Card title="Hello World" col={4}>
                <CardBody>Welcome to Performance Dashboard</CardBody>
            </Card>
        </CardGroup>,
    );
    expect(wrapper.container).toMatchSnapshot();
});
