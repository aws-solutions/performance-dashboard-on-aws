import React from "react";
import "./Button.css";

type Variant =
  | "base"
  | "default"
  | "outline"
  | "secondary"
  | "accent"
  | "unstyled";

interface Props {
  onClick?: Function;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  ariaLabel?: string;
  disabledToolTip?: string;
}

const VARIANT_CLASSNAMES = {
  outline: "usa-button--outline",
  secondary: "usa-button--secondary",
  accent: "usa-button--accent-cool",
  unstyled: "usa-button--unstyled"
}

const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<Props>>((props, ref) => {
  const variantClassName = props.variant
    ? VARIANT_CLASSNAMES[props.variant as keyof typeof VARIANT_CLASSNAMES] ?? "usa-button--base"
    : "usa-button--base";

  let additionalClasses = "";
  if (props.className) {
    additionalClasses = ` ${props.className}`;
  }

  const button = (
    <button
      aria-label={props.ariaLabel}
      className={`usa-button ${variantClassName}${additionalClasses}`}
      disabled={props.disabled}
      ref={ref}
      type={props.type}
      onClick={() => props.onClick?.()}
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
