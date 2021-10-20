import React, { ReactNode } from "react";
import { useWindowSize } from "../hooks";

interface Props {
  children: ReactNode;
  className?: string;
  //Distance from the top of the page (in pixels) that this element will stick at
  stickyPosition?: number;
}

function SecondaryActionBar(props: Props) {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 600;

  return (
    <div
      className={`border-base-lighter border-1px shadow-2 z-300 radius-md padding-x-2 padding-top-2 padding-bottom-1 margin-top-2 margin-bottom-1 bg-white ${
        isMobile ? "" : "position-sticky "
      }${props.className}`}
      style={{ top: props.stickyPosition }}
    >
      {props.children}
    </div>
  );
}

export default SecondaryActionBar;
