import "./DropdownMenu.css";
import { Menu, MenuList, MenuButton } from "@reach/menu-button";
import React, { ReactNode } from "react";

type Variant =
  | "base"
  | "default"
  | "outline"
  | "secondary"
  | "accent"
  | "unstyled";

interface DropdownProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  buttonText: string;
}

function DropdownMenu(props: DropdownProps) {
  let variantClassName = "";
  switch (props.variant) {
    case "base":
      variantClassName = " usa-button--base";
      break;
    case "outline":
      variantClassName = " usa-button--outline";
      break;
    case "secondary":
      variantClassName = " usa-button--secondary";
      break;
    case "accent":
      variantClassName = " usa-button--accent-cool";
      break;
    case "unstyled":
      variantClassName = " usa-button--unstyled";
      break;
    default:
      variantClassName = " usa-button--base";
      break;
  }

  let additionalClasses = "";
  if (props.className) {
    additionalClasses = ` ${props.className}`;
  }

  return (
    <Menu>
      <MenuButton
        className={`usa-button${variantClassName}${additionalClasses}`}
        aria-label={props.ariaLabel}
      >
        {props.buttonText} <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList>{props.children}</MenuList>
    </Menu>
  );
}

export default DropdownMenu;
