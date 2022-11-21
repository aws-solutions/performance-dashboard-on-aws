/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from "react";

interface AccordionProps {
  children: ReactNode;
}

function Accordion(props: AccordionProps) {
  return <div className="usa-accordion">{props.children}</div>;
}

interface ItemProps {
  id: string;
  title: string;
  children: ReactNode;
  hidden?: boolean;
}

function Item(props: ItemProps) {
  return (
    <>
      <h2 className="usa-accordion__heading">
        <button
          className="usa-accordion__button"
          aria-expanded={props.hidden ? "false" : "true"}
          aria-controls={props.id}
        >
          {props.title}
        </button>
      </h2>
      <div
        id={props.id}
        className="usa-accordion__content usa-prose"
        hidden={props.hidden ? true : false}
      >
        <ul>{props.children}</ul>
      </div>
    </>
  );
}

Accordion.Item = Item;
export default Accordion;
