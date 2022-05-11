import React, { KeyboardEvent, MouseEvent, ReactNode } from "react";
import "./Button.scss";

type Variant =
  | "base"
  | "default"
  | "outline"
  | "secondary"
  | "accent"
  | "unstyled";

interface Props {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  variant?: Variant;
  className?: string;
  testid?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  ariaLabel?: string;
  ariaCurrent?:
    | boolean
    | "time"
    | "false"
    | "true"
    | "page"
    | "step"
    | "location"
    | "date"
    | undefined;
  disabledToolTip?: string;
}

const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
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

  const button = (
    <button
      data-testid={props.testid}
      aria-label={props.ariaLabel}
      aria-current={props.ariaCurrent}
      className={`usa-button${variantClassName}${additionalClasses}`}
      disabled={props.disabled}
      ref={ref}
      type={props.type}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
      }}
      onKeyDown={(e) => {
        if (props.onKeyDown) {
          props.onKeyDown(e);
        }
      }}
    >
      {props.children}
    </button>
  );

  // show disabled tooltips
  if (props.disabled && props.disabledToolTip) {
    return (
      <span
        data-toggle="tooltip"
        data-placement="top"
        title={props.disabledToolTip}
      >
        {button}
      </span>
    );
  }

  return button;
});

export default Button;
