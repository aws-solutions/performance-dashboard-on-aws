import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  //Distance from the top of the page (in pixels) that this element will stick at
  stickyPosition?: number;
}

function PrimaryActionBar(props: Props) {
  return (
    <div
      className={`border-base-lighter border-1px shadow-3 z-500 radius-md padding-2 bg-white position-sticky ${props.className}`}
      style={{ top: props.stickyPosition }}
    >
      {props.children}
    </div>
  );
}

export default PrimaryActionBar;
