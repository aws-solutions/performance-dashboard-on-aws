import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

function Header(props: Props) {
  return (
    <header
      className={`border-base-lighter border-width-1px shadow-2 z-500 position-sticky top-0 bg-white ${props.className}`}
    >
      {props.children}
    </header>
  );
}

export default Header;
