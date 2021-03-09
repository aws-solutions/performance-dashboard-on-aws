import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

function ContentItem(props: Props) {
  return (
    <div
      className={`border-base-lighter border-1px shadow-1 z-200 radius-lg ${props.className}`}
    >
      {props.children}
    </div>
  );
}

export default ContentItem;
