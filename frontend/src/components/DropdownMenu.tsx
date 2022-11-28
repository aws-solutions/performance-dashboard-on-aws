/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import "./DropdownMenu.css";
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import React, { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";

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
  disabled?: boolean;
  icon?: IconDefinition;
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
        disabled={props.disabled}
      >
        {props.buttonText}
        <FontAwesomeIcon
          icon={props.icon ?? faCaretDown}
          className="margin-left-1"
        />
      </MenuButton>
      <MenuList className="font-sans-xs">{props.children}</MenuList>
    </Menu>
  );
}

DropdownMenu.MenuItem = MenuItem;
DropdownMenu.MenuLink = MenuLink;

export default DropdownMenu;
