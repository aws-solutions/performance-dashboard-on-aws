import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

function PrimaryActionBar(props: Props) {
  return (
    <div
      className={`border-base-lighter border-1px shadow-3 z-top radius-md padding-2 ${props.className}`}
    >
      {props.children}
    </div>
  );
}

export default PrimaryActionBar;
