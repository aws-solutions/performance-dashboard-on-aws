/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Link from "../components/Link";
import Utils from "../services/UtilsService";

interface CardGroupProps {
    children: React.ReactNode;
}

function CardGroup(props: CardGroupProps) {
    return (
        <ul className="usa-card-group">
            {React.Children.map(props.children, (child) => {
                if ((child as React.ReactElement).type === Card) {
                    return child;
                }
            })}
        </ul>
    );
}

interface CardProps {
    id: string;
    title: string;
    col: number;
    children: React.ReactNode;
    link?: string;
}

function Card(props: CardProps) {
    return (
        <li
            key={`card-${props.id}`}
            id={`card-${Utils.getShorterId(props.id)}`}
            className={`usa-card cursor-default tablet:grid-col-${props.col}`}
        >
            <div className="usa-card__container">
                <header className="usa-card__header">
                    <h2 className="usa-card__heading font-family-sans">
                        {props.link ? <Link to={props.link}>{props.title}</Link> : props.title}
                    </h2>
                </header>
                {React.Children.map(props.children, (child) => {
                    if ((child as React.ReactElement).type === CardBody) {
                        return child;
                    }
                })}
                {React.Children.map(props.children, (child) => {
                    if ((child as React.ReactElement).type === CardFooter) {
                        return child;
                    }
                })}
            </div>
        </li>
    );
}

interface CardBodyProps {
    children: React.ReactNode;
}

function CardBody(props: CardBodyProps) {
    return <div className="usa-card__body">{props.children}</div>;
}

interface CardFooterProps {
    children: React.ReactNode;
}

function CardFooter(props: CardFooterProps) {
    return <div className="usa-card__footer">{props.children}</div>;
}

CardGroup.CardFooter = CardFooter;
CardGroup.CardBody = CardBody;
CardGroup.Card = Card;
export default CardGroup;
