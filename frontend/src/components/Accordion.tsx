import React, { ReactNode } from "react";

interface AccordionProps {
  children: ReactNode;
}

function Accordion(props: AccordionProps) {
  return (
    <div className="usa-accordion" aria-multiselectable="true">
      {props.children}
    </div>
  );
}

interface ItemProps {
  id: string;
  title: string;
  children: ReactNode;
}

function Item(props: ItemProps) {
  return (
    <>
      <h2 className="usa-accordion__heading">
        <button
          className="usa-accordion__button"
          aria-expanded="true"
          aria-controls={props.id}
        >
          {props.title}
        </button>
      </h2>
      <div id={props.id} className="usa-accordion__content usa-prose">
        {props.children}
      </div>
    </>
  );
}

Accordion.Item = Item;
export default Accordion;
