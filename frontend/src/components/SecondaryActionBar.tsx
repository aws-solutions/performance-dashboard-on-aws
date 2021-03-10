import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  //Distance from the top of the page (in pixels) that this element will stick at
  stickyPosition?: number;
}

function SecondaryActionBar(props: Props) {
  return (
    <div
      className={`border-base-lighter border-1px shadow-2 z-300 radius-md padding-2 position-sticky bg-white ${props.className}`}
      style={{ top: props.stickyPosition }}
    >
      {props.children}
    </div>
  );
}

export default SecondaryActionBar;
