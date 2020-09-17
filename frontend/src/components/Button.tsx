import React, { ReactNode } from "react";

type Variant =
  | "base"
  | "default"
  | "outline"
  | "secondary"
  | "accent"
  | "unstyled";

interface Props {
  children: ReactNode;
  onClick?: Function;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  ariaLabel?: string;
}

function Button(props: Props) {
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
      break;
  }

  let additionalClasses = "";
  if (props.className) {
    additionalClasses = ` ${props.className}`;
  }

  return (
    <button
      aria-label={props.ariaLabel}
      className={`usa-button${variantClassName}${additionalClasses}`}
      disabled={props.disabled}
      type={props.type}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {props.children}
    </button>
  );
}

export default Button;
